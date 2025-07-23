import axios from 'axios';

export const checkUserBlacklist = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.get(`https://api.karma.lendsqr.com/api/v1/blacklist`, {
      params: { email },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Authorization': `Bearer YOUR_API_KEY` // ← if API key is needed
      },
    });

    return response.data?.isBlacklisted || false;
  } catch (error: any) {
    console.error('❌ Karma API Error:', error?.response?.data || error.message);
    throw new Error('Failed to verify blacklist status');
  }
};