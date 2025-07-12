# Google Maps Integration Setup

## Overview

The contact page now includes an interactive Google Maps component that shows the church location with a custom marker and directions functionality.

## Features

- Interactive Google Maps with custom church marker
- Automatic geocoding of the church address
- Info window with church details and phone number
- "Get Directions" button that opens Google Maps directions
- Fallback to regular Google Maps links if API fails
- Responsive design that works on all devices

## Setup Instructions

### 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:

   - **Maps JavaScript API** (required)
   - **Geocoding API** (required)
   - **Places API** (optional, for enhanced features)

4. Create credentials:
   - Go to "Credentials" in the sidebar
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Configure the API Key

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Add your Google Maps API key to `.env.local`:
   ```bash
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

### 3. Secure Your API Key (Important!)

For production, you should restrict your API key:

1. In Google Cloud Console, go to "Credentials"
2. Click on your API key
3. Under "API restrictions", select "Restrict key"
4. Choose the APIs you enabled
5. Under "Website restrictions", add your domains:
   - `localhost:*` (for development)
   - `your-domain.com` (for production)

### 4. Church Location Details

The map is configured for:

- **Address**: 14801 Lincoln Ave, Dolton, Illinois 60419
- **Church Name**: Christ Apostolic Church Hours of Mercy
- **Zoom Level**: 16 (street level view)

## Component Usage

The GoogleMap component can be reused elsewhere in the app:

```jsx
import GoogleMap from "../components/GoogleMap";

<GoogleMap
  address="14801 Lincoln Ave, Dolton, Illinois 60419"
  churchName="Christ Apostolic Church Hours of Mercy"
  height={400}
  zoom={16}
/>;
```

## Fallback Behavior

If the Google Maps API fails to load or is not configured:

- Shows a warning message with a direct link to Google Maps
- All direction buttons still work using Google Maps URLs
- No breaking of the page functionality

## Cost Considerations

Google Maps API usage pricing:

- Maps JavaScript API: $7 per 1,000 map loads
- Geocoding API: $5 per 1,000 requests
- You get $200 free credit per month

For a church website, typical usage should stay within the free tier.

## Troubleshooting

### Map not showing:

1. Check browser console for API key errors
2. Verify API key is set in `.env.local`
3. Ensure APIs are enabled in Google Cloud Console
4. Check API key restrictions

### Geocoding errors:

1. Verify the address format is correct
2. Check if Geocoding API is enabled
3. Look for quota exceeded errors

### Common error messages:

- "Failed to load Google Maps": API key issue
- "Could not find address": Geocoding problem
- "This page can't load Google Maps correctly": API key restrictions
