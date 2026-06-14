import { AlgorithmSnippet, Difficulty, Language } from '../types';

const GROK_API_BASE = 'https://api.x.ai/v1';

export async function generateQuestion(
  apiKey: string,
  language: Language,
  difficulty: Difficulty,
  category: string
): Promise<AlgorithmSnippet | null> {
  const complexityMap: Record<Difficulty, string> = {
    Easy: 'simple, short (8-15 lines), beginner-friendly',
    Medium: 'moderately complex (15-35 lines), uses common patterns',
    Hard: 'complex and comprehensive (35-60 lines), advanced techniques',
  };

  const prompt = `Generate a ${difficulty} ${language} code snippet for typing practice.
Topic/Category: ${category}
Code style: ${complexityMap[difficulty]}

Rules:
- Write ONLY the function/class body, no explanatory comments
- Use proper indentation and clean formatting
- Make it a real, working algorithm or data structure
- No markdown, no code fences in your response

Return ONLY a valid JSON object with this exact structure (no markdown around it):
{
  "title": "Descriptive name for the algorithm",
  "description": "One line explaining what it does",
  "category": "${category}",
  "code": "the actual clean code here",
  "estimatedTime": estimated_seconds_for_avg_typist_as_integer
}`;

  try {
    const response = await fetch(`${GROK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content:
              'You are a programming expert that generates clean, well-formatted code snippets for typing practice. Always return only valid JSON with no markdown or code fences.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Grok API error:', response.status, err);
      return null;
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    // Strip any accidental markdown fences
    const cleaned = content.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.code || !parsed.title) return null;

    return {
      id: `grok_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: parsed.title,
      category: parsed.category || category,
      difficulty,
      language,
      description: parsed.description || '',
      code: parsed.code,
      estimatedTime: parsed.estimatedTime || 90,
      isGenerated: true,
    };
  } catch (err) {
    console.error('Grok API exception:', err);
    return null;
  }
}
