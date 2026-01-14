'use client';

import { debugLog } from '@/lib/logger'

import { useState, useEffect, useRef, Suspense } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Maximize2, Minimize2, Settings, Monitor, Share2, Square } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type RtpCodecCapability = {
  mimeType: string
  clockRate?: number
  channels?: number
  sdpFmtpLine?: string
}

type RtpEncodingWithMinBitrate = RTCRtpEncodingParameters & {
  minBitrate?: number
  adaptivePtime?: boolean
}

type IceCandidateStats = RTCStats & {
  candidateType?: string
}

function CallVideoContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user') || 'user1';
  const roomId = searchParams.get('room') || 'default-room';
  const isCaller = userId === 'user1';

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLocalStreamMaximized, setIsLocalStreamMaximized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Подключение...');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [availableMicrophones, setAvailableMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>('');
  const [showMicrophoneMenu, setShowMicrophoneMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidateCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const signalingCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cameraMenuRef = useRef<HTMLDivElement>(null);
  const microphoneMenuRef = useRef<HTMLDivElement>(null);
  const qualityMenuRef = useRef<HTMLDivElement>(null);
  const isChangingQualityRef = useRef<boolean>(false);

  // Настройки качества видео с оптимизированными битрейтами для международных звонков
  const videoQualitySettings = {
    low: { 
      width: 640, 
      height: 480, 
      frameRate: 15,
      bitrate: 500000, // 500 kbps (увеличен для лучшего качества)
      minBitrate: 200000, // Минимальный битрейт
    },
    medium: { 
      width: 1280, 
      height: 720, 
      frameRate: 24,
      bitrate: 2000000, // 2 Mbps (увеличен для HD)
      minBitrate: 800000,
    },
    high: { 
      width: 1920, 
      height: 1080, 
      frameRate: 30,
      bitrate: 4000000, // 4 Mbps (увеличен для Full HD)
      minBitrate: 1500000,
    },
    ultra: { 
      width: 3840, 
      height: 2160, 
      frameRate: 30,
      bitrate: 12000000, // 12 Mbps (увеличен для 4K)
      minBitrate: 5000000,
    },
  };

  const qualityLabels = {
    low: '480p (SD)',
    medium: '720p (HD)',
    high: '1080p (Full HD)',
    ultra: '4K (Ultra HD)',
  };

  // Конфигурация WebRTC с глобальными STUN и TURN серверами для любых стран
  // Работает для любых комбинаций: Таиланд-Россия, Россия-Россия, Таиланд-Таиланд и т.д.
  const rtcConfiguration: RTCConfiguration = {
    iceServers: [
      // STUN серверы Google (глобальные, работают из любой страны)
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      
      // Альтернативные STUN серверы
      { urls: 'stun:stun.stunprotocol.org:3478' },
      { urls: 'stun:stun.services.mozilla.com:3478' },
      
      // Глобальные TURN серверы Metered.ca (работают для любых стран)
      {
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:openrelay.metered.ca:443?transport=tcp',
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      // Альтернативные TURN серверы Metered.ca
      {
        urls: [
          'turn:relay.metered.ca:80',
          'turn:relay.metered.ca:443',
          'turn:relay.metered.ca:443?transport=tcp',
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
    ],
    iceTransportPolicy: 'all', // Используем и UDP и TCP для максимальной совместимости
    iceCandidatePoolSize: 10, // Больше кандидатов для лучшего выбора маршрута
  };

  // Функция для настройки параметров передачи аудио
  const configureAudioSender = async (sender: RTCRtpSender) => {
    try {
      const params = sender.getParameters();
      if (!params.encodings) {
        params.encodings = [{}];
      }

      // Настройки для высокого качества аудио при международных звонках
      const audioEncoding: RtpEncodingWithMinBitrate = {
        ...params.encodings[0],
        maxBitrate: 128000, // 128 kbps для высокого качества аудио
        minBitrate: 32000, // Минимум 32 kbps
        // Приоритет аудио трека
        networkPriority: 'high',
      };
      params.encodings[0] = audioEncoding as RTCRtpEncodingParameters;

      await sender.setParameters(params);
      debugLog('Audio sender configured with high quality settings');
    } catch (error) {
      console.error('Ошибка настройки параметров аудио:', error);
    }
  };

  // Функция для настройки параметров передачи видео (битрейт и другие параметры)
  const configureVideoSender = async (sender: RTCRtpSender, quality: typeof videoQuality) => {
    try {
      const params = sender.getParameters();
      if (!params.encodings) {
        params.encodings = [{}];
      }

      const qualitySettings = videoQualitySettings[quality];
      
      // Настраиваем параметры для максимального качества при международных звонках
      const encoding: RtpEncodingWithMinBitrate = {
        ...params.encodings[0],
        maxBitrate: qualitySettings.bitrate,
        minBitrate: qualitySettings.minBitrate,
        // Не уменьшаем разрешение для максимальной четкости
        scaleResolutionDownBy: 1,
        maxFramerate: qualitySettings.frameRate,
        // Приоритет видео трека (высокий)
        networkPriority: 'high',
        // Адаптивное качество для международных соединений
        adaptivePtime: false,
      };
      params.encodings[0] = encoding as RTCRtpEncodingParameters;

      // Пытаемся установить приоритет кодеков (поддерживается не всеми браузерами)
      try {
        // Настройка кодеков для лучшего качества
        // Примечание: setCodecPreferences доступен не во всех браузерах
        if ('setCodecPreferences' in sender) {
          const codecs = RTCRtpReceiver.getCapabilities('video')?.codecs || [];
          // Приоритизируем VP9 и H264 для лучшего качества
          const preferredCodecs = codecs.filter(codec => 
            codec.mimeType === 'video/VP9' || 
            codec.mimeType === 'video/H264' ||
            codec.mimeType === 'video/VP8'
          ) as RtpCodecCapability[];
          const senderWithPrefs = sender as RTCRtpSender & {
            setCodecPreferences?: (codecs: RtpCodecCapability[]) => void
          }
          senderWithPrefs.setCodecPreferences?.(preferredCodecs);
        }
      } catch {
        // Игнорируем ошибки кодеков, используем браузерные настройки по умолчанию
        debugLog('Codec preferences not supported, using browser defaults');
      }

      await sender.setParameters(params);
      debugLog(`Video sender configured with bitrate: ${qualitySettings.bitrate / 1000000} Mbps (min: ${qualitySettings.minBitrate / 1000000} Mbps)`);
    } catch (error) {
      console.error('Ошибка настройки параметров видео:', error);
      // Fallback на более простую конфигурацию
      try {
        const params = sender.getParameters();
        if (!params.encodings) {
          params.encodings = [{}];
        }
        const qualitySettings = videoQualitySettings[quality];
        const fallbackEncoding: RtpEncodingWithMinBitrate = {
          ...params.encodings[0],
          maxBitrate: qualitySettings.bitrate,
          minBitrate: qualitySettings.minBitrate,
        };
        params.encodings[0] = fallbackEncoding as RTCRtpEncodingParameters;
        await sender.setParameters(params);
      } catch (fallbackError) {
        console.error('Ошибка при fallback настройке параметров:', fallbackError);
      }
    }
  };

  // Автоматический запрос разрешений и получение списка устройств
  useEffect(() => {
    const requestPermissionsAndGetDevices = async () => {
      try {
        // Сразу запрашиваем доступ к камере и микрофону
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        // Останавливаем поток, нам нужны только разрешения и список устройств
        stream.getTracks().forEach(track => track.stop());
        
        setPermissionsGranted(true);
        
        // Получаем список всех устройств с labels
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === 'videoinput');
        const microphones = devices.filter((device) => device.kind === 'audioinput');
        
        setAvailableCameras(cameras);
        setAvailableMicrophones(microphones);
        
        // Выбираем первые устройства по умолчанию
        if (cameras.length > 0 && !selectedCameraId) {
          setSelectedCameraId(cameras[0].deviceId);
        }
        if (microphones.length > 0 && !selectedMicrophoneId) {
          setSelectedMicrophoneId(microphones[0].deviceId);
        }
      } catch (error) {
        const err = error as { name?: string; message?: string }
        console.error('Ошибка запроса разрешений:', err);
        // Улучшенная обработка ошибок разрешений
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setConnectionStatus('Необходимо разрешить доступ к камере и микрофону');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setConnectionStatus('Камера или микрофон не найдены');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setConnectionStatus('Ошибка доступа к камере или микрофону');
        } else {
          setConnectionStatus(`Ошибка: ${err.message || 'Неизвестная ошибка'}`);
        }
      }
    };

    requestPermissionsAndGetDevices();

    // Функция для обновления списка устройств при их изменении
    const updateDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === 'videoinput');
        const microphones = devices.filter((device) => device.kind === 'audioinput');
        setAvailableCameras(cameras);
        setAvailableMicrophones(microphones);
      } catch (error) {
        console.error('Ошибка обновления списка устройств:', error);
      }
    };

    // Слушаем изменения устройств
    navigator.mediaDevices.addEventListener('devicechange', updateDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Инициализация локального потока
  useEffect(() => {
    if (!permissionsGranted) return;
    if (!selectedCameraId && availableCameras.length === 0) return;
    
    // Пропускаем пересоздание потока, если качество меняется программно
    if (isChangingQualityRef.current) {
      return;
    }

    const initStream = async () => {
      try {
        const quality = videoQualitySettings[videoQuality];
        const videoConstraints: MediaTrackConstraints = selectedCameraId
          ? {
              deviceId: { exact: selectedCameraId },
              width: { exact: quality.width },
              height: { exact: quality.height },
              frameRate: { ideal: quality.frameRate, max: quality.frameRate },
            }
          : {
              width: { exact: quality.width },
              height: { exact: quality.height },
              frameRate: { ideal: quality.frameRate, max: quality.frameRate },
            };

        const audioConstraints: MediaStreamConstraints['audio'] = selectedMicrophoneId
          ? {
              deviceId: { exact: selectedMicrophoneId },
            }
          : true;

        const constraints: MediaStreamConstraints = {
          video: videoConstraints,
          audio: audioConstraints,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localStreamRef.current = stream;
          setIsCallActive(true);
          
          // Обновляем выбранную камеру
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack && videoTrack.getSettings().deviceId) {
            setSelectedCameraId(videoTrack.getSettings().deviceId || '');
          }
          
          // Обновляем выбранный микрофон
          const audioTrack = stream.getAudioTracks()[0];
          if (audioTrack && audioTrack.getSettings().deviceId) {
            setSelectedMicrophoneId(audioTrack.getSettings().deviceId || '');
          }
        }
      } catch (error) {
        console.error('Ошибка доступа к медиа устройствам:', error);
        // Если exact не работает, пробуем с ideal
        try {
          const quality = videoQualitySettings[videoQuality];
          const fallbackConstraints: MediaStreamConstraints = {
            video: selectedCameraId
              ? {
                  deviceId: { exact: selectedCameraId },
                  width: { ideal: quality.width },
                  height: { ideal: quality.height },
                  frameRate: { ideal: quality.frameRate },
                }
              : {
                  width: { ideal: quality.width },
                  height: { ideal: quality.height },
                  frameRate: { ideal: quality.frameRate },
                },
            audio: selectedMicrophoneId 
              ? { deviceId: { exact: selectedMicrophoneId } }
              : true,
          };
          
          const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localStreamRef.current = stream;
            setIsCallActive(true);
            
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack && videoTrack.getSettings().deviceId) {
              setSelectedCameraId(videoTrack.getSettings().deviceId || '');
            }
            
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack && audioTrack.getSettings().deviceId) {
              setSelectedMicrophoneId(audioTrack.getSettings().deviceId || '');
            }
          }
        } catch (fallbackError) {
          console.error('Ошибка при fallback доступе к медиа:', fallbackError);
          setConnectionStatus('Ошибка доступа к камере/микрофону');
        }
      }
    };

    initStream();

    return () => {
      if (localStreamRef.current && !isChangingQualityRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCameraId, selectedMicrophoneId, availableCameras.length, availableMicrophones.length, permissionsGranted, videoQuality]);

  // Создание PeerConnection
  useEffect(() => {
    if (!localStreamRef.current || !isCallActive) return;

    const pc = new RTCPeerConnection(rtcConfiguration);
    peerConnectionRef.current = pc;

    // Добавляем локальные треки в peer connection
    localStreamRef.current.getTracks().forEach((track) => {
      const sender = pc.addTrack(track, localStreamRef.current!);
      // Настраиваем параметры передачи для видео трека
      if (track.kind === 'video') {
        configureVideoSender(sender, videoQuality);
      } else if (track.kind === 'audio') {
        // Настраиваем параметры аудио для максимального качества
        configureAudioSender(sender);
      }
    });

    // Обработка удаленного потока
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setIsConnected(true);
        setConnectionStatus('Подключено');
      }
    };

    // Обработка ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && event.candidate.candidate) {
        sendSignaling('ice-candidate', event.candidate.toJSON()).catch(err => {
          console.error('Ошибка отправки ICE candidate:', err);
        });
      }
    };

    // Обработка ошибок ICE
    pc.onicecandidateerror = (event) => {
      console.warn('ICE candidate error:', event);
    };

    // Обработка изменения состояния соединения
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      setConnectionStatus(state);
      if (state === 'connected') {
        setIsConnected(true);
      } else if (state === 'disconnected') {
        setIsConnected(false);
        setConnectionStatus('Отключено');
      } else if (state === 'failed') {
        setIsConnected(false);
        setConnectionStatus('Ошибка подключения');
      } else if (state === 'closed') {
        setIsConnected(false);
        setConnectionStatus('Соединение закрыто');
      }
    };

    // Обработка изменения ICE соединения
    pc.oniceconnectionstatechange = () => {
      const iceState = pc.iceConnectionState;
      debugLog('ICE connection state:', iceState);
      
      if (iceState === 'failed') {
        console.warn('ICE connection failed, attempting restart...');
        // Попытка перезапуска ICE
        try {
          pc.restartIce();
        } catch (error) {
          console.error('Ошибка перезапуска ICE:', error);
        }
      } else if (iceState === 'connected' || iceState === 'completed') {
        // Соединение установлено - проверяем тип соединения
        const stats = pc.getStats();
        stats.then((report) => {
          report.forEach((stat) => {
            if (stat.type === 'candidate-pair') {
              const pair = stat as RTCIceCandidatePairStats & {
                selected?: boolean
                localCandidateId?: string
                remoteCandidateId?: string
              }

              if (!pair.selected) return

              const localCandidate = pair.localCandidateId
                ? (report.get(pair.localCandidateId) as IceCandidateStats | undefined)
                : undefined

              if (localCandidate?.candidateType) {
                const connectionType = localCandidate.candidateType
                debugLog('Connection type:', connectionType);
                if (connectionType === 'relay') {
                  debugLog('Using TURN relay - оптимальное соединение между любыми странами');
                  setConnectionStatus('Подключено через TURN сервер');
                } else if (connectionType === 'srflx') {
                  debugLog('Using STUN reflexive for connection');
                  setConnectionStatus('Подключено');
                } else {
                  setConnectionStatus('Подключено напрямую');
                }
              }
            }
          });
        }).catch((error) => {
          console.warn('Error getting connection stats:', error);
        });
      }
    };

    // Обработка ICE gathering state для мониторинга
    pc.onicegatheringstatechange = () => {
      debugLog('ICE gathering state:', pc.iceGatheringState);
      if (pc.iceGatheringState === 'complete') {
        debugLog('ICE gathering complete');
      }
    };

    // Если мы caller, создаем offer
    if (isCaller) {
      createOffer();
    } else {
      // Если мы callee, ждем offer и создаем answer
      waitForOffer();
    }

    return () => {
      if (iceCandidateCheckIntervalRef.current) {
        clearInterval(iceCandidateCheckIntervalRef.current);
        iceCandidateCheckIntervalRef.current = null;
      }
      if (signalingCheckIntervalRef.current) {
        clearInterval(signalingCheckIntervalRef.current);
        signalingCheckIntervalRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCaller, isCallActive, roomId]);

  // Функция для отправки signaling данных с повторными попытками
  const sendSignaling = async (type: string, data: unknown, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch('/api/webrtc/signaling', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, type, data }),
        });
        
        if (response.ok) {
          debugLog(`Signaling ${type} sent successfully`);
          return true;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error(`Ошибка отправки signaling (попытка ${attempt + 1}/${retries}):`, error);
        if (attempt < retries - 1) {
          // Ждем перед повторной попыткой (экспоненциальная задержка)
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    return false;
  };

  // Функция для получения signaling данных с повторными попытками
  const getSignaling = async <T,>(type: string, retries = 3): Promise<T | null> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(
          `/api/webrtc/signaling?roomId=${roomId}&type=${type}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-cache',
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        return result.data as T;
      } catch (error) {
        console.error(`Ошибка получения signaling (попытка ${attempt + 1}/${retries}):`, error);
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        }
      }
    }
    return null;
  };

  // Создание offer (для caller)
  const createOffer = async () => {
    if (!peerConnectionRef.current) return;

    try {
      // Создаем offer с оптимизированными настройками для максимального качества
      const offerOptions: RTCOfferOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: false,
        // Приоритет качества для международных звонков
      };
      
      const offer = await peerConnectionRef.current.createOffer(offerOptions);
      
      if (!offer || !offer.sdp) {
        throw new Error('Failed to create offer');
      }
      
      await peerConnectionRef.current.setLocalDescription(offer);
      debugLog('Local description (offer) set successfully');
      
      // Отправляем offer с повторными попытками
      const offerSent = await sendSignaling('offer', offer, 5);
      if (offerSent) {
        debugLog('Offer sent successfully');
        setConnectionStatus('Звонок инициирован, ожидание ответа...');
      } else {
        console.error('Failed to send offer after multiple retries');
        setConnectionStatus('Ошибка отправки предложения');
        return;
      }

      // Ждем answer
      waitForAnswer();
    } catch (error) {
      console.error('Ошибка создания offer:', error);
      setConnectionStatus('Ошибка создания предложения');
    }
  };

  // Ожидание answer (для caller)
  const waitForAnswer = () => {
    let attempts = 0;
    const maxAttempts = 300; // 150 секунд максимум для международных соединений
    
    const checkInterval = setInterval(async () => {
      attempts++;
      
      // Показываем прогресс каждые 10 секунд
      if (attempts % 20 === 0) {
        const secondsWaited = Math.floor(attempts / 2);
        setConnectionStatus(`Ожидание ответа... (${secondsWaited}с)`);
      }
      
      if (attempts > maxAttempts) {
        clearInterval(checkInterval);
        signalingCheckIntervalRef.current = null;
        setConnectionStatus('Таймаут ожидания ответа. Проверьте подключение.');
        console.error('Timeout waiting for answer after', maxAttempts * 0.5, 'seconds');
        return;
      }

      try {
        const answer = await getSignaling<RTCSessionDescriptionInit>('answer');
        if (answer && peerConnectionRef.current) {
          // Проверяем, что answer валидный
          if (!answer.type || !answer.sdp) {
            console.warn('Invalid answer format:', answer);
            return;
          }
          
          clearInterval(checkInterval);
          signalingCheckIntervalRef.current = null;
          
          try {
            // Проверяем состояние peer connection перед установкой
            if (peerConnectionRef.current.signalingState === 'closed' || 
                peerConnectionRef.current.connectionState === 'closed') {
              console.error('Peer connection is closed, cannot set remote description');
              setConnectionStatus('Соединение закрыто');
              return;
            }
            
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
            
            debugLog('Remote description (answer) set successfully');
            
            // Настраиваем параметры передачи после установки remote description
            const videoSender = peerConnectionRef.current
              .getSenders()
              .find((s) => s.track && s.track.kind === 'video');
            if (videoSender) {
              await configureVideoSender(videoSender, videoQuality);
            }
            
            const audioSender = peerConnectionRef.current
              .getSenders()
              .find((s) => s.track && s.track.kind === 'audio');
            if (audioSender) {
              await configureAudioSender(audioSender);
            }
            
            checkForIceCandidates();
            setConnectionStatus('Ответ получен, установка соединения...');
          } catch (error) {
            const err = error as { message?: string }
            console.error('Ошибка установки answer:', err);
            const errorMessage = err?.message || String(error || 'Неизвестная ошибка');
            setConnectionStatus(`Ошибка установки ответа: ${errorMessage}`);
            
            // Подробное логирование для отладки
            console.error('Peer connection state:', {
              signalingState: peerConnectionRef.current?.signalingState,
              connectionState: peerConnectionRef.current?.connectionState,
              iceConnectionState: peerConnectionRef.current?.iceConnectionState,
            });
            
            // Попытка перезапуска ICE при ошибке только если соединение не закрыто
            if (peerConnectionRef.current && 
                peerConnectionRef.current.signalingState !== 'closed' &&
                peerConnectionRef.current.connectionState !== 'closed') {
              try {
                debugLog('Attempting ICE restart...');
                // Не пересоздаем offer сразу, ждем немного
                setTimeout(() => {
                  if (peerConnectionRef.current && 
                      peerConnectionRef.current.signalingState !== 'closed') {
                    createOffer(); // Пересоздаем offer
                  }
                }, 2000);
              } catch (restartError) {
                console.error('Ошибка перезапуска ICE:', restartError);
              }
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке answer:', error);
        // Продолжаем проверку даже при ошибке сети
      }
    }, 500);
    signalingCheckIntervalRef.current = checkInterval;
  };

  // Ожидание offer (для callee)
  const waitForOffer = () => {
    let attempts = 0;
    const maxAttempts = 300; // 150 секунд максимум для международных соединений
    
    const checkInterval = setInterval(async () => {
      attempts++;
      
      // Показываем прогресс каждые 10 секунд
      if (attempts % 20 === 0) {
        const secondsWaited = Math.floor(attempts / 2);
        setConnectionStatus(`Ожидание входящего звонка... (${secondsWaited}с)`);
      }
      
      if (attempts > maxAttempts) {
        clearInterval(checkInterval);
        signalingCheckIntervalRef.current = null;
        setConnectionStatus('Таймаут ожидания звонка');
        console.error('Timeout waiting for offer after', maxAttempts * 0.5, 'seconds');
        return;
      }

      try {
        const offer = await getSignaling<RTCSessionDescriptionInit>('offer');
        if (offer && peerConnectionRef.current) {
          // Проверяем, что offer валидный
          if (!offer.type || !offer.sdp) {
            console.warn('Invalid offer format:', offer);
            return;
          }
          
          clearInterval(checkInterval);
          signalingCheckIntervalRef.current = null;
          
          try {
            // Проверяем состояние peer connection
            if (peerConnectionRef.current.signalingState === 'closed' || 
                peerConnectionRef.current.connectionState === 'closed') {
              console.error('Peer connection is closed, cannot set remote description');
              setConnectionStatus('Соединение закрыто');
              return;
            }
            
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(offer)
            );
            
            debugLog('Remote description (offer) set successfully');
            setConnectionStatus('Получен звонок, создание ответа...');
            
            // Настраиваем параметры передачи перед созданием answer
            const videoSender = peerConnectionRef.current
              .getSenders()
              .find((s) => s.track && s.track.kind === 'video');
            if (videoSender) {
              await configureVideoSender(videoSender, videoQuality);
            }
            
            const audioSender = peerConnectionRef.current
              .getSenders()
              .find((s) => s.track && s.track.kind === 'audio');
            if (audioSender) {
              await configureAudioSender(audioSender);
            }
            
            const answerOptions: RTCAnswerOptions = {};
            const answer = await peerConnectionRef.current.createAnswer(answerOptions);
            
            if (!answer || !answer.sdp) {
              throw new Error('Failed to create answer');
            }
            
            await peerConnectionRef.current.setLocalDescription(answer);
            
            // Отправляем answer с повторными попытками
            const answerSent = await sendSignaling('answer', answer, 5);
            if (answerSent) {
              debugLog('Answer sent successfully');
              setConnectionStatus('Ответ отправлен, установка соединения...');
              checkForIceCandidates();
            } else {
              console.error('Failed to send answer after multiple retries');
              setConnectionStatus('Ошибка отправки ответа');
            }
          } catch (error) {
            const err = error as { message?: string }
            console.error('Ошибка обработки offer:', err);
            setConnectionStatus(`Ошибка обработки предложения: ${err?.message || 'Неизвестная ошибка'}`);
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке offer:', error);
        // Продолжаем проверку даже при ошибке сети
      }
    }, 500);
    signalingCheckIntervalRef.current = checkInterval;
  };

  // Проверка новых ICE candidates
  const checkForIceCandidates = () => {
    let lastIndex = 0;
    let attempts = 0;
    const maxAttempts = 300; // 5 минут максимум
    
    const checkInterval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts || !peerConnectionRef.current) {
        clearInterval(checkInterval);
        iceCandidateCheckIntervalRef.current = null;
        return;
      }

      const candidates = await getSignaling<RTCIceCandidateInit[]>('ice-candidates');
      if (candidates && Array.isArray(candidates) && candidates.length > lastIndex) {
        if (peerConnectionRef.current) {
          for (let i = lastIndex; i < candidates.length; i++) {
            try {
              if (peerConnectionRef.current.remoteDescription) {
                await peerConnectionRef.current.addIceCandidate(
                  new RTCIceCandidate(candidates[i])
                );
              }
            } catch (error) {
              // Игнорируем ошибки, если remoteDescription еще не установлен
              if (peerConnectionRef.current.remoteDescription) {
                console.error('Ошибка добавления ICE candidate:', error);
              }
            }
          }
          lastIndex = candidates.length;
        }
      }
    }, 1000);
    iceCandidateCheckIntervalRef.current = checkInterval;
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  // Запуск шаринга экрана
  const startScreenShare = async () => {
    try {
      // Получаем поток экрана
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        } as MediaTrackConstraints,
        audio: true, // Захватываем системный звук, если доступно
      });

      screenStreamRef.current = screenStream;

      // Обработка остановки шаринга через браузерный UI
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      // Получаем текущие треки
      const currentVideoTrack = localStreamRef.current?.getVideoTracks()[0];
      const screenVideoTrack = screenStream.getVideoTracks()[0];
      const screenAudioTrack = screenStream.getAudioTracks()[0];

      if (!localStreamRef.current) {
        console.error('Local stream not available');
        return;
      }

      // Заменяем видео трек на экран
      if (currentVideoTrack && screenVideoTrack) {
        // Удаляем старый видео трек
        localStreamRef.current.removeTrack(currentVideoTrack);
        currentVideoTrack.stop();
        
        // Добавляем экран как видео трек
        localStreamRef.current.addTrack(screenVideoTrack);
      }

      // Если есть аудио от экрана, добавляем его (системный звук)
      // Но сохраняем текущий микрофон если он есть
      if (screenAudioTrack) {
        // Добавляем аудио от экрана как дополнительный трек (для системного звука)
        localStreamRef.current.addTrack(screenAudioTrack);
      }

      // Обновляем видео элемент
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      // Обновляем peer connection
      if (peerConnectionRef.current && screenVideoTrack) {
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        
        if (sender) {
          await sender.replaceTrack(screenVideoTrack);
          // Настраиваем параметры для экрана (высокое качество)
          await configureVideoSender(sender, 'high');
        }
      }

      setIsScreenSharing(true);
      setIsVideoEnabled(true);
      debugLog('Screen sharing started');
    } catch (error) {
      console.error('Ошибка запуска шаринга экрана:', error);
      setConnectionStatus('Ошибка запуска шаринга экрана');
    }
  };

  // Остановка шаринга экрана
  const stopScreenShare = async () => {
    if (!screenStreamRef.current || !localStreamRef.current) {
      setIsScreenSharing(false);
      return;
    }

    try {
      // Получаем текущий видео трек (это экран)
      const screenVideoTrack = localStreamRef.current.getVideoTracks()[0];
      
      // Останавливаем треки экрана
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;

      // Восстанавливаем камеру только если была выбрана камера
      if (!selectedCameraId) {
        // Если камера не была выбрана, просто удаляем видео трек экрана
        if (screenVideoTrack) {
          localStreamRef.current.removeTrack(screenVideoTrack);
          screenVideoTrack.stop();
        }
        setIsScreenSharing(false);
        return;
      }

      const quality = videoQualitySettings[videoQuality];
      
      // Получаем новый поток с камерой
      let cameraStream;
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCameraId },
            width: { exact: quality.width },
            height: { exact: quality.height },
            frameRate: { ideal: quality.frameRate, max: quality.frameRate },
          },
          audio: false, // Не запрашиваем аудио от камеры, используем существующий микрофон
        });
      } catch {
        // Fallback к ideal если exact не работает
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCameraId },
            width: { ideal: quality.width },
            height: { ideal: quality.height },
            frameRate: { ideal: quality.frameRate },
          },
          audio: false,
        });
      }

      const cameraVideoTrack = cameraStream.getVideoTracks()[0];

      // Удаляем видео трек экрана
      if (screenVideoTrack && cameraVideoTrack) {
        localStreamRef.current.removeTrack(screenVideoTrack);
        screenVideoTrack.stop();
        // Добавляем видео трек камеры
        localStreamRef.current.addTrack(cameraVideoTrack);
      }

      // Останавливаем ненужные треки из нового потока камеры
      cameraStream.getTracks().forEach((track) => {
        if (track !== cameraVideoTrack) {
          track.stop();
        }
      });

      // Обновляем видео элемент
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      // Обновляем peer connection
      if (peerConnectionRef.current && cameraVideoTrack) {
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        
        if (sender) {
          await sender.replaceTrack(cameraVideoTrack);
          await configureVideoSender(sender, videoQuality);
        }
      }

      setIsScreenSharing(false);
      setIsVideoEnabled(true);
      debugLog('Screen sharing stopped, camera restored');
    } catch (error) {
      console.error('Ошибка остановки шаринга экрана:', error);
      setIsScreenSharing(false);
      // При ошибке просто удаляем видео трек экрана
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      const screenVideoTrack = localStreamRef.current?.getVideoTracks()[0];
      if (screenVideoTrack) {
        localStreamRef.current?.removeTrack(screenVideoTrack);
        screenVideoTrack.stop();
      }
    }
  };

  // Переключение шаринга экрана
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const endCall = async () => {
    // Очищаем signaling
    await fetch('/api/webrtc/signaling', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, type: 'clear' }),
    });

    // Останавливаем все треки
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Останавливаем шаринг экрана
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    setIsScreenSharing(false);

    // Закрываем peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Очищаем видео элементы
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Очищаем интервалы
    if (iceCandidateCheckIntervalRef.current) {
      clearInterval(iceCandidateCheckIntervalRef.current);
    }
    if (signalingCheckIntervalRef.current) {
      clearInterval(signalingCheckIntervalRef.current);
    }

    setIsCallActive(false);
    setIsConnected(false);
    setConnectionStatus('Звонок завершен');
  };

  const toggleMaximize = () => {
    setIsLocalStreamMaximized(!isLocalStreamMaximized);
  };

  // Переключение камеры
  const switchCamera = async (cameraId: string) => {
    if (cameraId === selectedCameraId || !localStreamRef.current) return;
    
    // Не переключаем камеру во время шаринга экрана
    if (isScreenSharing) {
      debugLog('Cannot switch camera while screen sharing');
      return;
    }

    try {
      const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
      const quality = videoQualitySettings[videoQuality];
      
      // Получаем новый поток с выбранной камерой и качеством
      let newStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: cameraId },
            width: { exact: quality.width },
            height: { exact: quality.height },
            frameRate: { ideal: quality.frameRate, max: quality.frameRate },
          },
          audio: selectedMicrophoneId ? { deviceId: { exact: selectedMicrophoneId } } : true,
        });
      } catch {
        // Fallback к ideal если exact не работает
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: cameraId },
            width: { ideal: quality.width },
            height: { ideal: quality.height },
            frameRate: { ideal: quality.frameRate },
          },
          audio: selectedMicrophoneId ? { deviceId: { exact: selectedMicrophoneId } } : true,
        });
      }

      const newVideoTrack = newStream.getVideoTracks()[0];
      const currentAudioTrack = localStreamRef.current.getAudioTracks()[0];

      // Заменяем видео трек в локальном потоке
      if (oldVideoTrack && newVideoTrack) {
        localStreamRef.current.removeTrack(oldVideoTrack);
        oldVideoTrack.stop();
        localStreamRef.current.addTrack(newVideoTrack);
        
        // Убеждаемся, что аудио трек остался (используем текущий, а не из нового потока)
        if (!currentAudioTrack) {
          const newAudioTrack = newStream.getAudioTracks()[0];
          if (newAudioTrack) {
            localStreamRef.current.addTrack(newAudioTrack);
          }
        }
      }

      // Обновляем видео элемент
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      // Обновляем трек в peer connection
      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        
        if (sender && newVideoTrack) {
          await sender.replaceTrack(newVideoTrack);
          // Настраиваем параметры передачи с правильным битрейтом
          await configureVideoSender(sender, videoQuality);
        }
      }

      // Останавливаем все треки из нового потока (они уже добавлены в локальный поток или не нужны)
      newStream.getTracks().forEach((track) => track.stop());

      setSelectedCameraId(cameraId);
      setShowCameraMenu(false);
    } catch (error) {
      console.error('Ошибка переключения камеры:', error);
    }
  };

  // Переключение микрофона
  const switchMicrophone = async (microphoneId: string) => {
    if (microphoneId === selectedMicrophoneId || !localStreamRef.current) return;

    try {
      const oldAudioTrack = localStreamRef.current.getAudioTracks()[0];
      
      // Получаем новый поток с выбранным микрофоном
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: selectedCameraId 
          ? { deviceId: { exact: selectedCameraId } }
          : true,
        audio: { deviceId: { exact: microphoneId } },
      });

      const newAudioTrack = newStream.getAudioTracks()[0];
      if (!newAudioTrack) {
        newStream.getTracks().forEach((track) => track.stop());
        return;
      }

      // Заменяем аудио трек в локальном потоке
      if (oldAudioTrack) {
        localStreamRef.current.removeTrack(oldAudioTrack);
        oldAudioTrack.stop();
      }
      localStreamRef.current.addTrack(newAudioTrack);

      // Обновляем трек в peer connection
      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === 'audio');
        
        if (sender && newAudioTrack) {
          try {
            await sender.replaceTrack(newAudioTrack);
            // Настраиваем параметры аудио после замены трека
            await configureAudioSender(sender);
          } catch (replaceError) {
            console.error('Ошибка замены аудио трека в peer connection:', replaceError);
          }
        }
      }

      // Останавливаем ненужные треки из нового потока
      newStream.getVideoTracks().forEach((track) => track.stop());
      if (newStream.getAudioTracks().length > 1) {
        newStream.getAudioTracks().slice(1).forEach((track) => track.stop());
      }

      setSelectedMicrophoneId(microphoneId);
      setShowMicrophoneMenu(false);
    } catch (error) {
      console.error('Ошибка переключения микрофона:', error);
    }
  };

  // Изменение качества видео
  const changeVideoQuality = async (quality: 'low' | 'medium' | 'high' | 'ultra') => {
    if (quality === videoQuality || !localStreamRef.current || !selectedCameraId) return;
    
    // Не меняем качество во время шаринга экрана
    if (isScreenSharing) {
      debugLog('Cannot change video quality while screen sharing');
      return;
    }

    // Устанавливаем флаг, чтобы предотвратить пересоздание потока в useEffect
    isChangingQualityRef.current = true;
    setShowQualityMenu(false);

    try {
      const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
      if (!oldVideoTrack) {
        isChangingQualityRef.current = false;
        return;
      }

      const qualitySettings = videoQualitySettings[quality];
      
      // Получаем новый поток с новым качеством
      let newStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCameraId },
            width: { exact: qualitySettings.width },
            height: { exact: qualitySettings.height },
            frameRate: { ideal: qualitySettings.frameRate, max: qualitySettings.frameRate },
          },
          audio: selectedMicrophoneId ? { deviceId: { exact: selectedMicrophoneId } } : true,
        });
      } catch {
        // Fallback к ideal если exact не работает
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCameraId },
            width: { ideal: qualitySettings.width },
            height: { ideal: qualitySettings.height },
            frameRate: { ideal: qualitySettings.frameRate },
          },
          audio: selectedMicrophoneId ? { deviceId: { exact: selectedMicrophoneId } } : true,
        });
      }

      const newVideoTrack = newStream.getVideoTracks()[0];
      if (!newVideoTrack) {
        newStream.getTracks().forEach((track) => track.stop());
        isChangingQualityRef.current = false;
        return;
      }

      // Сначала заменяем трек в peer connection (если есть)
      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        
        if (sender && newVideoTrack) {
          try {
            await sender.replaceTrack(newVideoTrack);
            // Настраиваем параметры передачи с новым битрейтом
            await configureVideoSender(sender, quality);
          } catch (replaceError) {
            console.error('Ошибка замены трека в peer connection:', replaceError);
          }
        }
      }

      // Затем заменяем трек в локальном потоке
      if (oldVideoTrack) {
        try {
          localStreamRef.current.removeTrack(oldVideoTrack);
          oldVideoTrack.stop();
        } catch (removeError) {
          console.error('Ошибка удаления старого трека:', removeError);
        }
      }

      localStreamRef.current.addTrack(newVideoTrack);

      // Обновляем видео элемент
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      // Останавливаем ненужные треки из нового потока
      newStream.getAudioTracks().forEach((track) => track.stop());
      if (newStream.getVideoTracks().length > 1) {
        newStream.getVideoTracks().slice(1).forEach((track) => track.stop());
      }

      // Обновляем состояние только после успешной замены
      setVideoQuality(quality);
      
    } catch (error) {
      console.error('Ошибка изменения качества видео:', error);
      
      // Если не удалось установить 4K, автоматически понижаем до Full HD
      if (quality === 'ultra') {
        try {
          const highQuality = videoQualitySettings['high'];
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: selectedCameraId },
              width: { ideal: highQuality.width },
              height: { ideal: highQuality.height },
              frameRate: { ideal: highQuality.frameRate },
            },
            audio: true,
          });
          const fallbackTrack = fallbackStream.getVideoTracks()[0];
          const oldTrack = localStreamRef.current?.getVideoTracks()[0];
          
          if (oldTrack && fallbackTrack) {
            // Заменяем в peer connection
            if (peerConnectionRef.current) {
              const sender = peerConnectionRef.current
                .getSenders()
                .find((s) => s.track && s.track.kind === 'video');
              if (sender && fallbackTrack) {
                await sender.replaceTrack(fallbackTrack);
                // Настраиваем параметры передачи
                await configureVideoSender(sender, 'high');
              }
            }
            
            // Заменяем в локальном потоке
            localStreamRef.current.removeTrack(oldTrack);
            oldTrack.stop();
            localStreamRef.current.addTrack(fallbackTrack);
            
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStreamRef.current;
            }
          }
          
          fallbackStream.getAudioTracks().forEach((track) => track.stop());
          if (fallbackStream.getVideoTracks().length > 1) {
            fallbackStream.getVideoTracks().slice(1).forEach((track) => track.stop());
          }
          
          setVideoQuality('high');
        } catch (fallbackError) {
          console.error('Ошибка установки резервного качества:', fallbackError);
        }
      }
    } finally {
      // Сбрасываем флаг после завершения операции
      isChangingQualityRef.current = false;
    }
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cameraMenuRef.current &&
        !cameraMenuRef.current.contains(event.target as Node)
      ) {
        setShowCameraMenu(false);
      }
      if (
        qualityMenuRef.current &&
        !qualityMenuRef.current.contains(event.target as Node)
      ) {
        setShowQualityMenu(false);
      }
      if (
        microphoneMenuRef.current &&
        !microphoneMenuRef.current.contains(event.target as Node)
      ) {
        setShowMicrophoneMenu(false);
      }
    };

    if (showCameraMenu || showQualityMenu || showMicrophoneMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCameraMenu, showQualityMenu, showMicrophoneMenu]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 relative overflow-hidden">
      {/* Индикатор статуса */}
      <div className="absolute top-4 left-4 z-40 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
        <div className="text-sm">
          <div>Пользователь: {userId}</div>
          <div>Комната: {roomId}</div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span className="text-xs">{connectionStatus}</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Качество: {qualityLabels[videoQuality]}
          </div>
          {isScreenSharing && (
            <div className="text-xs text-blue-400 mt-1 flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              <span>Шаринг экрана активен</span>
            </div>
          )}
        </div>
      </div>

      {/* Основное видео (удаленный пользователь) */}
      <div className="flex-1 relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ backgroundColor: '#1f2937' }}
        />
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Phone className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-300">Ожидание подключения...</p>
              <p className="text-sm text-gray-400 mt-2">
                {isCaller
                  ? 'Инициализация звонка...'
                  : 'Ожидание входящего звонка...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Локальное видео (превью) */}
      <div
        className={`absolute ${
          isLocalStreamMaximized
            ? 'top-0 left-0 w-full h-full z-20'
            : 'bottom-24 right-4 w-64 h-48 md:w-80 md:h-60 z-10'
        } rounded-lg overflow-hidden shadow-2xl transition-all duration-300 border-2 border-gray-700`}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ backgroundColor: '#374151' }}
        />
        {!isVideoEnabled && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <VideoOff className="w-12 h-12 text-gray-500" />
          </div>
        )}
        <button
          onClick={toggleMaximize}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all z-20"
        >
          {isLocalStreamMaximized ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Панель управления */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent py-6 z-30">
        <div className="flex items-center justify-center gap-4">
          {/* Кнопка микрофона */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isAudioEnabled ? 'Выключить микрофон' : 'Включить микрофон'}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>

          {/* Кнопка камеры */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isVideoEnabled ? 'Выключить камеру' : 'Включить камеру'}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>

          {/* Кнопка шаринга экрана */}
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-all ${
              isScreenSharing
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title={isScreenSharing ? 'Остановить шаринг экрана' : 'Начать шаринг экрана'}
          >
            {isScreenSharing ? (
              <Square className="w-6 h-6" />
            ) : (
              <Share2 className="w-6 h-6" />
            )}
          </button>

          {/* Кнопка выбора микрофона */}
          {availableMicrophones.length > 1 && (
            <div className="relative" ref={microphoneMenuRef}>
              <button
                onClick={() => setShowMicrophoneMenu(!showMicrophoneMenu)}
                className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all relative"
                title="Выбрать микрофон"
              >
                <Mic className="w-6 h-6" />
                {showMicrophoneMenu && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 rounded-lg shadow-2xl min-w-[200px] border border-gray-700 overflow-hidden z-50">
                    <div className="px-3 py-2 border-b border-gray-700">
                      <p className="text-xs text-gray-400 font-medium">Выберите микрофон</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {availableMicrophones.map((microphone) => (
                        <button
                          key={microphone.deviceId}
                          onClick={() => switchMicrophone(microphone.deviceId)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            selectedMicrophoneId === microphone.deviceId
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                selectedMicrophoneId === microphone.deviceId
                                  ? 'bg-white'
                                  : 'bg-gray-500'
                              }`}
                            />
                            <span className="truncate">
                              {microphone.label || `Микрофон ${availableMicrophones.indexOf(microphone) + 1}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Кнопка выбора камеры */}
          {availableCameras.length > 1 && (
            <div className="relative" ref={cameraMenuRef}>
              <button
                onClick={() => setShowCameraMenu(!showCameraMenu)}
                className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all relative"
                title="Выбрать камеру"
              >
                <Settings className="w-6 h-6" />
                {showCameraMenu && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 rounded-lg shadow-2xl min-w-[200px] border border-gray-700 overflow-hidden z-50">
                    <div className="px-3 py-2 border-b border-gray-700">
                      <p className="text-xs text-gray-400 font-medium">Выберите камеру</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {availableCameras.map((camera) => (
                        <button
                          key={camera.deviceId}
                          onClick={() => switchCamera(camera.deviceId)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            selectedCameraId === camera.deviceId
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                selectedCameraId === camera.deviceId
                                  ? 'bg-white'
                                  : 'bg-gray-500'
                              }`}
                            />
                            <span className="truncate">
                              {camera.label || `Камера ${availableCameras.indexOf(camera) + 1}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Кнопка выбора качества видео */}
          <div className="relative" ref={qualityMenuRef}>
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all relative"
              title="Выбрать качество видео"
            >
              <Monitor className="w-6 h-6" />
              {showQualityMenu && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 rounded-lg shadow-2xl min-w-[220px] border border-gray-700 overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-gray-700">
                    <p className="text-xs text-gray-400 font-medium">Качество видео</p>
                  </div>
                  <div className="overflow-y-auto">
                    {(Object.keys(qualityLabels) as Array<'low' | 'medium' | 'high' | 'ultra'>).map((quality) => (
                      <button
                        key={quality}
                        onClick={() => changeVideoQuality(quality)}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          videoQuality === quality
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                videoQuality === quality
                                  ? 'bg-white'
                                  : 'bg-gray-500'
                              }`}
                            />
                            <span>{qualityLabels[quality]}</span>
                          </div>
                          {quality === 'ultra' && (
                            <span className="text-xs text-yellow-400">•</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Кнопка завершения звонка */}
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all"
            title="Завершить звонок"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Статус звонка */}
        <div className="text-center mt-4">
          <p className="text-white text-sm">
            {isCallActive
              ? isConnected
                ? 'Звонок активен'
                : 'Подключение...'
              : 'Звонок завершен'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CallVideoPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Загрузка...</p>
        </div>
      </div>
    }>
      <CallVideoContent />
    </Suspense>
  );
}
