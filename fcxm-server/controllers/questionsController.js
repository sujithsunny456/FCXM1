const OpenAI = require('openai')

// Fallback questions if OpenAI key not set or quota exceeded
const FALLBACK = {
  behavioral: [
    'Tell me about a time you handled a difficult situation at work.',
    'Describe a moment when you had to work under pressure.',
    'Give an example of a goal you set and how you achieved it.',
    'Tell me about a time you disagreed with a colleague. How did you resolve it?',
    'Describe a situation where you showed leadership.',
  ],
  technical: [
    'Walk me through your technical background and key skills.',
    'Describe a challenging technical problem you solved recently.',
    'How do you approach debugging a complex issue?',
    'Explain a technology or tool you are most proficient in.',
    'How do you stay current with new technologies in your field?',
  ],
  leadership: [
    'Tell me about your leadership style.',
    'Describe a time you motivated a team through a difficult project.',
    'How do you handle underperforming team members?',
    'Give an example of a strategic decision you made and its outcome.',
    'How do you prioritize when managing multiple projects?',
  ],
  general: [
    'Tell me about yourself.',
    'Why are you interested in this role?',
    'What are your greatest strengths?',
    'Where do you see yourself in 5 years?',
    'Why are you leaving your current position?',
  ],
}

// POST /api/questions/generate
async function generateQuestions(req, res) {
  const { jobTitle, skills, experience, interviewType } = req.body

  if (!jobTitle) {
    return res.status(400).json({ message: 'jobTitle is required' })
  }

  const type = interviewType || 'behavioral'

  // If no OpenAI key, return smart fallback immediately
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.log('ℹ️  No OpenAI key — using enhanced fallback questions')
    return res.json({ questions: buildFallback(jobTitle, skills, type), source: 'fallback' })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const prompt = buildPrompt(jobTitle, skills, experience, type)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical recruiter and interview coach. Generate targeted interview questions based on the candidate\'s profile. Return ONLY a JSON array of exactly 5 question strings, no extra text.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 600,
    })

    const raw = completion.choices[0].message.content.trim()

    // Parse the JSON array from the response
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('Invalid response format from OpenAI')

    const questions = JSON.parse(match[0])
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Empty questions array')
    }

    return res.json({ questions, source: 'ai' })

  } catch (err) {
    console.error('OpenAI error:', err.message)
    // Graceful fallback on any OpenAI error
    return res.json({
      questions: buildFallback(jobTitle, skills, type),
      source: 'fallback',
      note: 'AI unavailable — using tailored questions'
    })
  }
}

function buildPrompt(jobTitle, skills, experience, type) {
  const skillsText = skills ? `Key skills: ${skills}.` : ''
  const expText = experience ? `Experience level: ${experience} years.` : ''

  const typeInstructions = {
    behavioral: 'Focus on past behavior, teamwork, conflict resolution, and situational examples using the STAR method.',
    technical: `Focus on technical depth for the role. Ask about specific technologies, problem-solving approaches, and hands-on experience with their listed skills.`,
    leadership: 'Focus on leadership style, team management, decision-making, and strategic thinking.',
    general: 'Focus on motivation, career goals, cultural fit, and general professional background.',
  }

  return `Generate 5 ${type} interview questions for a candidate applying for the role of "${jobTitle}".
${skillsText}
${expText}
${typeInstructions[type] || typeInstructions.behavioral}
Make the questions specific to the job title and skills mentioned.
Return ONLY a JSON array of 5 question strings. Example: ["Question 1?", "Question 2?", ...]`
}

function buildFallback(jobTitle, skills, type) {
  // Build semi-personalized fallback questions using the job title and skills
  const skillList = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : []
  const topSkill = skillList[0] || 'your primary skill'
  const secondSkill = skillList[1] || 'your tools'

  const personalized = {
    behavioral: [
      `Tell me about a time you faced a major challenge in a ${jobTitle} role and how you overcame it.`,
      `Describe a situation where your experience with ${topSkill} made a significant impact on a project.`,
      `Give an example of when you had to quickly learn something new related to ${secondSkill}.`,
      `Tell me about a time you had to collaborate across teams to deliver a ${jobTitle} project.`,
      `Describe a moment when you had to prioritize competing deadlines in your work as a ${jobTitle}.`,
    ],
    technical: [
      `As a ${jobTitle}, how do you approach designing a solution from scratch using ${topSkill}?`,
      `Walk me through a complex technical problem you solved using ${topSkill} or ${secondSkill}.`,
      `What are the key best practices you follow when working with ${topSkill}?`,
      `How do you ensure code quality and maintainability in your ${jobTitle} work?`,
      `How do you stay up to date with the latest developments in ${topSkill} and related technologies?`,
    ],
    leadership: [
      `As a ${jobTitle}, how do you lead a team through a technically challenging project?`,
      `Describe how you mentor junior team members in skills like ${topSkill}.`,
      `How do you handle disagreements about technical direction in a ${jobTitle} role?`,
      `Give an example of a strategic decision you made as a ${jobTitle} and its outcome.`,
      `How do you balance technical debt with delivering new features in your ${jobTitle} role?`,
    ],
    general: [
      `Tell me about yourself and your journey to becoming a ${jobTitle}.`,
      `Why are you interested in a ${jobTitle} role and what excites you about it?`,
      `What do you consider your greatest strength as a ${jobTitle}?`,
      `Where do you see your career as a ${jobTitle} in the next 3–5 years?`,
      `What drew you to working with ${topSkill} and how has it shaped your career?`,
    ],
  }

  return personalized[type] || personalized.behavioral
}

module.exports = { generateQuestions }
