import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api')

// --- GET ALL PORTFOLIO DATA ---
app.get('/portfolio', async (c) => {
  const [hero, about, experience, skills, tools, contact] = await Promise.all([
    prisma.heroSection.findFirst(),
    prisma.aboutSection.findFirst(),
    prisma.experienceEntry.findMany({ orderBy: { order: 'asc' } }),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.tool.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactInfo.findFirst(),
  ])

  return c.json({
    hero: hero || {},
    about: about || {},
    experience: experience || [],
    skills: skills || [],
    tools: tools || [],
    contact: contact || { id: 1 },
  })
})

// --- HERO SECTION ---
app.post('/portfolio/hero', async (c) => {
  const body = await c.req.json()
  const hero = await prisma.heroSection.upsert({
    where: { id: 1 },
    update: body,
    create: { ...body, id: 1 },
  })
  return c.json(hero)
})

// --- ABOUT SECTION ---
app.post('/portfolio/about', async (c) => {
  const body = await c.req.json()
  const about = await prisma.aboutSection.upsert({
    where: { id: 1 },
    update: body,
    create: { ...body, id: 1 },
  })
  return c.json(about)
})

// --- EXPERIENCE SECTION ---
app.get('/portfolio/experience', async (c) => {
  const data = await prisma.experienceEntry.findMany({ orderBy: { order: 'asc' } })
  return c.json(data)
})

app.post('/portfolio/experience', async (c) => {
  try {
    const body = await c.req.json()
    console.log('Received experience data:', body)
    
    const { id, ...data } = body
    
    // Ensure correct types
    const formattedData = {
      ...data,
      order: typeof data.order === 'string' ? parseInt(data.order, 10) : data.order,
      techStack: Array.isArray(data.techStack) ? data.techStack : [],
    }

    if (id) {
      const updated = await prisma.experienceEntry.update({
        where: { id },
        data: formattedData,
      })
      return c.json(updated)
    } else {
      const created = await prisma.experienceEntry.create({
        data: formattedData,
      })
      return c.json(created)
    }
  } catch (error) {
    console.error('Error saving experience:', error)
    return c.json({ error: 'Failed to save experience' }, 500)
  }
})

app.delete('/portfolio/experience/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.experienceEntry.delete({ where: { id } })
    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return c.json({ error: 'Failed to delete experience' }, 500)
  }
})

// --- SKILLS SECTION ---
app.get('/portfolio/skills', async (c) => {
  const data = await prisma.skill.findMany({ orderBy: { order: 'asc' } })
  return c.json(data)
})

app.post('/portfolio/skills', async (c) => {
  try {
    const { name } = await c.req.json()
    const skill = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    return c.json(skill)
  } catch (error) {
    console.error('Error adding skill:', error)
    return c.json({ error: 'Failed to add skill' }, 500)
  }
})

app.delete('/portfolio/skills/:id', async (c) => {
  const id = c.req.param('id')
  await prisma.skill.delete({ where: { id } })
  return c.json({ success: true })
})

// --- TOOLS SECTION ---
app.get('/portfolio/tools', async (c) => {
  try {
    const data = await prisma.tool.findMany({ orderBy: { order: 'asc' } })
    return c.json(data)
  } catch (error: any) {
    console.error('Error fetching tools:', error)
    return c.json({ error: 'Failed to fetch tools', details: error?.message }, 500)
  }
})

app.post('/portfolio/tools', async (c) => {
  try {
    const { name } = await c.req.json()
    const tool = await prisma.tool.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    return c.json(tool)
  } catch (error) {
    console.error('Error adding tool:', error)
    return c.json({ error: 'Failed to add tool' }, 500)
  }
})

app.delete('/portfolio/tools/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.tool.delete({ where: { id } })
    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting tool:', error)
    return c.json({ error: 'Failed to delete tool' }, 500)
  }
})

// --- CONTACT SECTION ---
app.post('/portfolio/contact', async (c) => {
  const body = await c.req.json()
  const contact = await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: body,
    create: { ...body, id: 1 },
  })
  return c.json(contact)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
