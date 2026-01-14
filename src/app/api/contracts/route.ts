import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const contractsPath = path.join(process.cwd(), 'src/data/contracts.json')

export async function GET() {
  try {
    const data = fs.readFileSync(contractsPath, 'utf8')
    const contracts = JSON.parse(data)
    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Ошибка чтения договоров:', error)
    return NextResponse.json({ error: 'Ошибка чтения договоров' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = fs.readFileSync(contractsPath, 'utf8')
    const contracts = JSON.parse(data)
    
    const newContract = {
      id: `contract-${Date.now()}`,
      templateType: body.templateType,
      templateText: body.templateText || '',
      values: body.values || {},
      contractNumber: body.contractNumber || '',
      contractCity: body.contractCity || 'Москва',
      createdBy: body.createdBy || '',
      createdAt: new Date().toISOString(),
      filePathPDF: body.filePathPDF || '',
      filePathDOCX: body.filePathDOCX || ''
    }
    
    contracts.push(newContract)
    fs.writeFileSync(contractsPath, JSON.stringify(contracts, null, 2))
    
    return NextResponse.json(newContract)
  } catch (error) {
    console.error('Ошибка сохранения договора:', error)
    return NextResponse.json({ error: 'Ошибка сохранения договора' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const id = String(body?.id || '').trim()
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const data = fs.readFileSync(contractsPath, 'utf8')
    const contracts = JSON.parse(data)
    const nextContracts = Array.isArray(contracts)
      ? contracts.filter((contract) => contract.id !== id)
      : []

    if (nextContracts.length === contracts.length) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    fs.writeFileSync(contractsPath, JSON.stringify(nextContracts, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка удаления договора:', error)
    return NextResponse.json({ error: 'Ошибка удаления договора' }, { status: 500 })
  }
}
