import { createClient } from '@sanity/client';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

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

    // Handle Image Upload if provided
    let imageAssetId = null;
    if (data.screenshot && data.screenshot.base64) {
      try {
        // base64 format from FileReader is "data:image/png;base64,iVBORw0KGgo..."
        const base64Data = data.screenshot.base64.split(',')[1];
        if (base64Data) {
          const buffer = Buffer.from(base64Data, 'base64');
          
          const imageAsset = await client.assets.upload('image', buffer, {
            filename: data.screenshot.filename,
            contentType: data.screenshot.mimeType
          });
          
          imageAssetId = imageAsset._id;
        }
      } catch (err) {
        console.error('Error uploading image to Sanity:', err);
        return res.status(500).json({ error: 'Failed to upload screenshot image' });
      }
    }

    // Build the Document Object
    const doc = {
      _type: 'showcaseProject',
      title: data.siteName,
      url: data.siteUrl,
      author: data.authorName || 'Anonymous',
      authorUrl: data.authorPortfolio || '',
      contactEmail: data.contactEmail || undefined,
      tags: data.componentsUsed,
      socials: socialsArray.length > 0 ? socialsArray : undefined,
      image: imageAssetId ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId
        }
      } : undefined
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
