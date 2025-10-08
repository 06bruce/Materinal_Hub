# Testing Guide - Sector-Based Hospital Finder

## What We've Implemented

### Frontend Changes:
1. ✅ **SectorSelectionModal** - Modal component with all 30 Rwanda districts and sectors
2. ✅ **Rwanda Sectors Data** - Complete data file with all districts and sectors
3. ✅ **Updated HealthCenters Page** - Integrated sector selection and hospital display
4. ✅ **Updated API Utils** - Added new endpoint for sector-based hospital fetching

### Backend Changes:
1. ✅ **Hospital Database** - Sample hospital data with sector information (11 hospitals)
2. ✅ **New Controller Method** - `getHealthCentersBySector` function
3. ✅ **New Route** - `/api/health-centers/sector/:district/:sector`

## How to Test

### Step 1: Start Backend Server
```bash
cd /home/bruce-nshuti/Documents/Maternal_Server
npm start
```

Expected output:
- Server running on port 3001
- MongoDB connected
- Keep-alive service started

### Step 2: Start Frontend Server
```bash
cd /home/bruce-nshuti/Documents/Maternal_Hub
npm start
```

Expected output:
- App running on http://localhost:3000

### Step 3: Test the Feature

1. **Navigate to Health Centers Page**
   - Go to http://localhost:3000
   - Click on "Health Centers" or "Centers" in navigation

2. **Sector Selection Modal Should Appear**
   - Modal shows automatically on first visit
   - Search bar at top
   - All 30 districts displayed with their sectors

3. **Test Search Functionality**
   - Type "Kacyiru" - should show Gasabo district with Kacyiru sector
   - Type "Gasabo" - should show all Gasabo sectors
   - Type "Huye" - should show Huye district sectors

4. **Select a Sector**
   - Click on any sector (e.g., "Kacyiru" in Gasabo)
   - Modal should close
   - Location banner should appear showing selected sector
   - Loading spinner should appear
   - Hospitals should load (3+ hospitals)

5. **Verify Hospital Display**
   - Each hospital card should show:
     - Hospital name
     - Location
     - Distance (e.g., "2.5 km away")
     - Phone number
     - Hours
     - Rating with stars

6. **Test Change Location**
   - Click "Change Location" button in banner
   - Modal should reopen
   - Select different sector
   - New hospitals should load

7. **Test LocalStorage Persistence**
   - Refresh the page
   - Selected sector should be remembered
   - Hospitals should load automatically without showing modal

### Step 4: Test Backend API Directly

Test the new endpoint:
```bash
# Test Kacyiru sector in Gasabo district
curl http://localhost:3001/api/health-centers/sector/Gasabo/Kacyiru

# Test Kanombe sector in Kicukiro district
curl http://localhost:3001/api/health-centers/sector/Kicukiro/Kanombe

# Test Huye sector in Huye district
curl http://localhost:3001/api/health-centers/sector/Huye/Huye
```

Expected response format:
```json
{
  "district": "Gasabo",
  "sector": "Kacyiru",
  "count": 2,
  "hospitals": [
    {
      "id": 1,
      "name": "King Faisal Hospital",
      "district": "Gasabo",
      "sector": "Kacyiru",
      "location": "Kacyiru, Kigali",
      "phone": "3939",
      "emergencyPhone": "+250 788 309 000",
      "hours": "24/7 Emergency Services",
      "rating": 4.8,
      "distance": "1.2 km",
      "isInSector": true
    }
  ]
}
```

## Expected Behavior

### Successful Test Checklist:
- [ ] Modal appears on first visit to Health Centers page
- [ ] All 30 districts are visible
- [ ] Search functionality works
- [ ] Clicking a sector closes modal and shows location banner
- [ ] Hospitals load and display correctly
- [ ] Distance is shown for each hospital
- [ ] "Change Location" button works
- [ ] Selected sector persists after page refresh
- [ ] No console errors
- [ ] API calls succeed (check Network tab in DevTools)

## Common Issues & Solutions

### Issue 1: Modal doesn't appear
**Solution:** Check browser console for errors. Ensure framer-motion is installed.

### Issue 2: No hospitals load
**Solution:** 
- Check backend is running on port 3001
- Check Network tab for failed API calls
- Verify CORS is configured correctly

### Issue 3: "Change Location" doesn't work
**Solution:** Check that `showSectorModal` state is being updated correctly

### Issue 4: Hospitals show but no distance
**Solution:** This is expected for sectors without hospitals - fallback data is shown

## Browser Console Commands for Debugging

```javascript
// Check saved sector
localStorage.getItem('userSector')

// Clear saved sector
localStorage.removeItem('userSector')

// Check if modal should show
console.log('Modal state:', showSectorModal)
```

## Next Steps After Testing

If everything works:
1. Commit frontend changes
2. Commit backend changes
3. Push to GitHub
4. Deploy to Vercel (frontend) and Render (backend)

If issues found:
1. Note the specific error
2. Check browser console
3. Check backend logs
4. Fix issues before committing
