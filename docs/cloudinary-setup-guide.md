# Cloudinary Image Upload Setup Guide

This guide will help you set up Cloudinary integration for uploading cover images and profile pictures in your Novel Pedia application.

## Prerequisites

1. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com) if you don't have an account
2. **Upload Preset**: Create an unsigned upload preset in your Cloudinary dashboard

## Step 1: Cloudinary Dashboard Setup

### Create Upload Preset

1. Log into your Cloudinary dashboard
2. Go to **Settings** → **Upload**
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset name**: `novel-pedia-uploads` (or your choice)
   - **Signing Mode**: `Unsigned` ⚠️ **IMPORTANT**
   - **Use filename or externally defined Public ID**: Unchecked
   - **Unique filename**: Checked (recommended)
   - **Folder**: Leave empty (we handle this in code)
   - **Allowed formats**: `jpg,png,webp`
   - **Transform**: Add transformations if desired:
     - For covers: `c_fill,w_800,h_600,q_auto,f_auto`
     - For profiles: `c_fill,w_400,h_400,g_face,q_auto,f_auto`
   - **File size limit**: `5MB`
   - **Enable unsigned uploading**: ✅ **MUST BE ENABLED**
6. Save the preset

### Get Your Credentials

From your Cloudinary dashboard, note down:
- **Cloud Name**: Found in the dashboard overview
- **API Key**: Found in the dashboard overview  
- **API Secret**: Found in the dashboard overview (keep this secure!)

## Step 2: Environment Variables

Update your `.env` file with the following variables:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"
CLOUDINARY_API_SECRET="your_api_secret_here"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="novel-pedia-uploads"
```

**Important**: Replace the placeholder values with your actual Cloudinary credentials.

## Step 3: Install Dependencies

The required packages are already installed:
- `cloudinary` - Server-side Cloudinary SDK
- `@cloudinary/react` - React components
- `@cloudinary/url-gen` - URL generation utilities

## Step 4: Using the Components

### Profile Picture Upload

```tsx
import { ProfilePictureUpload } from '@/components/ui/profile-picture-upload'

function UserProfilePage() {
  const [profilePicture, setProfilePicture] = useState<string>('')

  const handleProfileUploaded = (imageUrl: string, publicId: string) => {
    setProfilePicture(imageUrl)
    // Save to your database via API
  }

  const handleProfileRemoved = () => {
    setProfilePicture('')
    // Remove from your database via API
  }

  return (
    <ProfilePictureUpload
      currentImageUrl={profilePicture}
      onImageUploaded={handleProfileUploaded}
      onImageRemoved={handleProfileRemoved}
      size="lg" // 'sm' | 'md' | 'lg'
    />
  )
}
```

### Cover Image Upload

```tsx
import { CoverImageUpload } from '@/components/ui/cover-image-upload'

function NovelEditPage() {
  const [coverImage, setCoverImage] = useState<string>('')

  const handleCoverUploaded = (imageUrl: string, publicId: string) => {
    setCoverImage(imageUrl)
    // Save to your database via API
  }

  const handleCoverRemoved = () => {
    setCoverImage('')
    // Remove from your database via API
  }

  return (
    <CoverImageUpload
      currentImageUrl={coverImage}
      onImageUploaded={handleCoverUploaded}
      onImageRemoved={handleCoverRemoved}
      aspectRatio="cover" // 'cover' (4:3) | 'square'
    />
  )
}
```

## Step 5: API Integration

The following API endpoints are available:

### Profile Picture
- `PATCH /api/profile/avatar` - Update profile picture
- `DELETE /api/profile/avatar` - Remove profile picture

### Novel Cover
- `PATCH /api/novels/[id]/cover` - Update novel cover
- `DELETE /api/novels/[id]/cover` - Remove novel cover

### Example API Usage

```tsx
// Update profile picture
const updateProfilePicture = async (imageUrl: string, publicId: string) => {
  const response = await fetch('/api/profile/avatar', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      avatarUrl: imageUrl,
      publicId: publicId,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update profile picture')
  }
  
  return await response.json()
}

// Update novel cover
const updateNovelCover = async (novelId: string, imageUrl: string) => {
  const response = await fetch(`/api/novels/${novelId}/cover`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      coverImageUrl: imageUrl,
    }),
  })
  
  return await response.json()
}
```

## Step 6: Database Integration

The Prisma schema already includes the necessary fields:

- `Profile.avatarUrl` - Stores profile picture URL
- `Novel.coverImageUrl` - Stores novel cover URL

No database migrations are required.

## Step 7: Image Optimization

The components automatically handle:
- **Compression**: Cloudinary auto-quality
- **Format**: Auto-format conversion (WebP when supported)
- **Responsive sizing**: Multiple sizes for different use cases
- **Transformations**: Automatic cropping and resizing

### URL Patterns

Generated URLs include optimizations:
```
https://res.cloudinary.com/your-cloud/image/upload/
  w_800,h_600,c_fill,g_auto,q_auto,f_auto/
  novel-covers/sample-cover
```

## Troubleshooting

### Common Issues

1. **"Upload preset must be whitelisted for unsigned uploads"**: 
   - Go to Cloudinary Settings → Upload → Upload presets
   - Find your preset and ensure "Signing Mode" is set to "Unsigned"
   - Make sure "Enable unsigned uploading" checkbox is checked
   - Save the preset

2. **Upload fails with 401**: Check your upload preset is set to "Unsigned"

3. **Images not displaying**: Verify the cloud name in environment variables

4. **Large file uploads fail**: Check file size limits in Cloudinary settings

5. **Authentication errors**: Ensure JWT token is properly passed to API routes

6. **"Invalid upload preset"**: Verify the preset name in your environment variables matches exactly

### Debug Mode

Add this to see upload progress and errors:

```tsx
const handleCoverUploaded = (imageUrl: string, publicId: string) => {
  console.log('Upload successful:', { imageUrl, publicId })
  // ... rest of your code
}
```

### Testing

Use the example page to test the integration:

```tsx
import { CloudinaryExamplePage } from '@/components/examples/cloudinary-example'

// Add this to a test route to verify everything works
```

## Security Notes

- **API Keys**: Never expose API secrets in client-side code
- **Upload Presets**: Use unsigned presets for client uploads
- **Authentication**: API routes verify JWT tokens
- **File Validation**: Components validate file types and sizes

## Performance Tips

1. **Image Sizing**: Use appropriate dimensions (800x600 for covers, 400x400 for profiles)
2. **Format**: Let Cloudinary auto-convert to optimal formats
3. **Caching**: Cloudinary URLs are automatically cached by CDN
4. **Lazy Loading**: Use `loading="lazy"` on image elements when displaying

## Production Checklist

- [ ] Environment variables configured
- [ ] Upload preset created and tested
- [ ] API endpoints working with authentication
- [ ] Database fields storing URLs correctly
- [ ] Image validation working
- [ ] Error handling implemented
- [ ] Progress indicators showing during uploads
- [ ] File size limits appropriate for your use case

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify Cloudinary dashboard settings match your code
3. Test API endpoints with tools like Postman
4. Check network tab for failed requests

The setup includes proper error handling, progress indicators, and automatic optimizations to provide a smooth user experience.