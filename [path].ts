import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // bezpečne cez prostredie

export default async (req: VercelRequest, res: VercelResponse) => {
  const { path = "" } = req.query;
  const githubApiUrl = `https://api.github.com/repos/merkytard/geppetto_prompt_library/contents/${path}`;

  const headers: any = {
    "Authorization": `Bearer ${GITHUB_TOKEN}`,
    "Accept": "application/vnd.github+json"
  };

  if (req.method === 'GET') {
    const githubResponse = await fetch(githubApiUrl, { headers });
    const data = await githubResponse.json();
    return res.status(githubResponse.status).json(data);
  }

  if (req.method === 'PUT') {
    const body = req.body;
    const githubResponse = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await githubResponse.json();
    return res.status(githubResponse.status).json(data);
  }

  res.status(405).json({ message: 'Method not allowed' });
};
