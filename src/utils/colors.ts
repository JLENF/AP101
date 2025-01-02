import { Rental } from '../types/rental';
import { supabase } from '../lib/supabase';

export const COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-green-100', text: 'text-green-800' },
  { bg: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  { bg: 'bg-orange-100', text: 'text-orange-800' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800' },
] as const;

async function getUserLastColor(userId: string): Promise<string | null> {
  try {
    console.log('Getting last color for user:', userId);
    
    // Check if we have a valid user ID
    if (!userId) {
      console.error('Invalid user ID provided to getUserLastColor');
      return null;
    }

    // Query user preferences
    const { data, error } = await supabase
      .from('user_preferences')
      .select('last_color, user_id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error getting last color:', error);
      return null;
    }

    if (!data) {
      console.log('No color preference found for user');
      return null;
    }

    console.log('Found color preference:', data);
    return data.last_color;
  } catch (error) {
    console.error('Error in getUserLastColor:', error);
    return null;
  }
}

async function saveUserLastColor(userId: string, color: string): Promise<boolean> {
  try {
    console.log('Attempting to save color:', { userId, color });
    
    // Check if we have valid inputs
    if (!userId || !color) {
      console.error('Invalid inputs to saveUserLastColor:', { userId, color });
      return false;
    }

    // First check if a record exists
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_preferences')
        .update({
          last_color: color,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating color preference:', updateError);
        return false;
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          last_color: color,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error inserting color preference:', insertError);
        return false;
      }
    }

    console.log('Successfully saved color preference');
    return true;
  } catch (error) {
    console.error('Error in saveUserLastColor:', error);
    return false;
  }
}

export async function getNextColor(existingRentals: Rental[], userId: string): Promise<string> {
  console.log('Getting next color for user:', userId);
  
  if (!userId) {
    console.error('No user ID provided for color selection');
    return COLORS[0].bg;
  }

  try {
    // Get user's last used color
    const lastColor = await getUserLastColor(userId);
    console.log('Retrieved last color:', lastColor);
    
    // If user has no last color, start with the first color
    if (!lastColor) {
      const firstColor = COLORS[0].bg;
      console.log('No last color found, using first color:', firstColor);
      await saveUserLastColor(userId, firstColor);
      return firstColor;
    }

    // Find the index of the last used color
    const lastColorIndex = COLORS.findIndex(color => color.bg === lastColor);
    console.log('Current color index:', lastColorIndex);
    
    // Get the next color in sequence (or go back to start if at end)
    const nextColorIndex = (lastColorIndex === -1 || lastColorIndex === COLORS.length - 1) ? 0 : lastColorIndex + 1;
    const nextColor = COLORS[nextColorIndex].bg;
    console.log('Selected next color:', nextColor);
    
    // Save the new color as the user's last color
    const saved = await saveUserLastColor(userId, nextColor);
    if (!saved) {
      console.warn('Failed to save color preference, but continuing with color selection');
    }
    
    return nextColor;
  } catch (error) {
    console.error('Error in getNextColor:', error);
    return COLORS[0].bg;
  }
}

export function getTextColorForBg(bgColor: string): string {
  const colorPair = COLORS.find(color => color.bg === bgColor);
  return colorPair?.text || 'text-gray-800';
}