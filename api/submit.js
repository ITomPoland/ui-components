import { createClient } from '@sanity/client';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Ensure the environment variables are available
  const projectId = process.env.VITE_SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !dataset || !token) {
    console.error('Missing Sanity credentials in environment variables.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const client = createClient({
    projectId,
    dataset,
    useCdn: false, // Must be false for writing data
    apiVersion: '2022-03-07',
    token // The secret token with Write access
  });

  try {
    const data = req.body;

    // Anti-spam Honeypot validation
    if (data._honeypot && data._honeypot.trim() !== '') {
      // If a bot filled out the hidden field, pretend it was successful but don't save
      return res.status(200).json({ message: 'Submission successful' });
    }

    // Basic validation
    if (!data.siteName || !data.siteUrl || !data.componentsUsed || data.componentsUsed.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format Social Links for Sanity Schema
    const socialsArray = [];
    if (data.socialX) {
      socialsArray.push({ _key: 'x_social', platform: 'x', url: data.socialX });
    }
    if (data.socialLinkedin) {
      socialsArray.push({ _key: 'linkedin_social', platform: 'linkedin', url: data.socialLinkedin });
    }

    // Build the Document Object
    const doc = {
      _type: 'showcaseProject',
      title: data.siteName,
      url: data.siteUrl,
      author: data.authorName || 'Anonymous',
      authorUrl: data.authorPortfolio || '',
      tags: data.components,
      socials: socialsArray.length > 0 ? socialsArray : undefined,
      // Note: We leave the 'image' field empty for now. The site owner will upload
      // the screenshot manually when reviewing the draft in Sanity Studio.
    };

    // Create the document as a DRAFT
    // Prefixing the ID with "drafts." ensures it won't appear on the live site
    // until the owner clicks "Publish" in the Sanity Studio.
    const customId = `drafts.submission-${Date.now()}`;

    await client.createIfNotExists({
      _id: customId,
      ...doc
    });

    res.status(200).json({ message: 'Submission successful' });
  } catch (error) {
    console.error('Error creating document in Sanity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
