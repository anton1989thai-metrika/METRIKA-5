import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const templatesPath = path.join(process.cwd(), 'src/data/templates.json')

export async function GET() {
  try {
    const data = fs.readFileSync(templatesPath, 'utf8')
    const templates = JSON.parse(data)
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Ошибка чтения шаблонов:', error)
    return NextResponse.json({ error: 'Ошибка чтения шаблонов' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = fs.readFileSync(templatesPath, 'utf8')
    const templates = JSON.parse(data)
    
    const newTemplate = {
      id: body.id || `template-${Date.now()}`,
      name: body.name,
      category: body.category,
      fields: body.fields || [],
      template: body.template || ''
    }
    
    templates.push(newTemplate)
    fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2))
    
    return NextResponse.json(newTemplate)
  } catch (error) {
    console.error('Ошибка сохранения шаблона:', error)
    return NextResponse.json({ error: 'Ошибка сохранения шаблона' }, { status: 500 })
  }
}

