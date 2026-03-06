// components/GymPhotoGallery.jsx
import { useState, useEffect } from "react";

export default function GymPhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("gymProgressPhotos");
    if (saved) {
      const photosObj = JSON.parse(saved);
      const photosArray = Object.entries(photosObj).map(([day, data]) => ({
        day: data.day,
        data: data.data,
        timestamp: data.timestamp
      })).sort((a, b) => a.day - b.day);
      setPhotos(photosArray);
    }
  }, []);

  return (
    <div className="gym-photo-gallery">
      <div className="gallery-header">
        <h3>📸 Progress Gallery</h3>
        <span className="photo-count">{photos.length} photos</span>
      </div>

      {photos.length > 0 ? (
        <div className="gallery-grid">
          {photos.map((photo) => (
            <div 
              key={photo.day} 
              className="gallery-item"
              onClick={() => setSelectedDay(photo.day)}
            >
              <img src={photo.data} alt={`Day ${photo.day}`} />
              <div className="photo-day">Day {photo.day}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-photos">
          <span className="no-photos-icon">📷</span>
          <p>No progress photos yet</p>
          <p className="no-photos-hint">Upload your first gym photo!</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedDay && (
        <div className="photo-lightbox" onClick={() => setSelectedDay(null)}>
          <div className="lightbox-content">
            <img 
              src={photos.find(p => p.day === selectedDay)?.data} 
              alt={`Day ${selectedDay}`}
            />
            <button className="close-lightbox">✕</button>
            <div className="lightbox-day">Day {selectedDay}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .gym-photo-gallery {
          margin: 20px 0;
          padding: 20px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        .app.dark .gym-photo-gallery {
          background: #2a2a2a;
        }
        
        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .gallery-header h3 {
          margin: 0;
          color: #333;
        }
        
        .app.dark .gallery-header h3 {
          color: white;
        }
        
        .photo-count {
          background: #667eea;
          color: white;
          padding: 5px 12px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
        }
        
        .gallery-item {
          position: relative;
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 1;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .gallery-item:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(102,126,234,0.3);
        }
        
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .photo-day {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          color: white;
          padding: 8px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }
        
        .no-photos {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        
        .no-photos-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 10px;
        }
        
        .no-photos-hint {
          font-size: 12px;
          opacity: 0.7;
          margin-top: 5px;
        }
        
        .photo-lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .lightbox-content {
          position: relative;
          max-width: 90%;
          max-height: 90%;
        }
        
        .lightbox-content img {
          max-width: 100%;
          max-height: 90vh;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .close-lightbox {
          position: absolute;
          top: -40px;
          right: 0;
          background: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .lightbox-day {
          position: absolute;
          bottom: -40px;
          left: 0;
          color: white;
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}