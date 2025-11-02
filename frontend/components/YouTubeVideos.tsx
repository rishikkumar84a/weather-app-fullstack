'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaYoutube } from 'react-icons/fa';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface YouTubeVideosProps {
  location: string;
}

export default function YouTubeVideos({ location }: YouTubeVideosProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [location]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${location}+weather+city+tour&type=video&maxResults=3&key=${YOUTUBE_API_KEY}`
      );
      setVideos(response.data.items || []);
    } catch (err) {
      console.error('Failed to fetch YouTube videos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaYoutube className="text-red-600" />
          YouTube Videos
        </h2>
        <div className="text-center py-8">Loading videos...</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaYoutube className="text-red-600" />
        Videos about {location}
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id.videoId} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition">
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-gray-800 line-clamp-2">
                  {video.snippet.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {video.snippet.description}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
