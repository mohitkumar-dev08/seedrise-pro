// components/GymPhotoUpload.jsx
import { useState, useEffect } from "react";

export default function GymPhotoUpload({ dayNumber, onPhotoUploaded }) {
  const [preview, setPreview] = useState(null);
  const [folderHandle, setFolderHandle] = useState(null);
  const [folderSelected, setFolderSelected] = useState(false);

  // ✅ Check if folder already selected
  useEffect(() => {
    const savedFolderPermission = localStorage.getItem("gymFolderPermission");
    if (savedFolderPermission) {
      // You can't restore folder handle from localStorage, so need to select again
      setFolderSelected(false);
    }
  }, []);

  // ✅ Select/Create "186-days-progress" folder
  const selectFolder = async () => {
    try {
      // Ask user to select a folder (they can create new)
      const handle = await window.showDirectoryPicker({
        id: 'gym-progress',
        mode: 'readwrite',
        startIn: 'documents'
      });
      
      // Create or get "186-days-progress" subfolder
      let gymFolder;
      try {
        gymFolder = await handle.getDirectoryHandle('186-days-progress', { create: true });
      } catch (err) {
        // If folder doesn't exist, create it
        gymFolder = await handle.getDirectoryHandle('186-days-progress', { create: true });
      }
      
      setFolderHandle(gymFolder);
      setFolderSelected(true);
      localStorage.setItem("gymFolderSelected", "true");
      alert('✅ Folder "186-days-progress" selected/created! Photos will save there.');
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Folder selection cancelled');
      } else {
        console.error('Error selecting folder:', err);
        alert('❌ Could not select folder. Using download instead.');
      }
    }
  };

  // ✅ Save file to folder
  const saveToFolder = async (file, fileName) => {
    try {
      if (!folderHandle) {
        throw new Error('No folder selected');
      }
      
      // Create file in folder
      const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
      
      // Write file
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();
      
      return true;
    } catch (err) {
      console.error('Error saving to folder:', err);
      return false;
    }
  };

  // ✅ Fallback download
  const downloadPhoto = (base64Data, fileName) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('❌ Only image files are allowed!');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('❌ File size should be less than 10MB');
      return;
    }

    // Create filename
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `day-${dayNumber}.${extension}`; // day-1.jpg, day-2.jpg

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      
      // Try to save to folder first
      if (folderHandle) {
        const saved = await saveToFolder(file, fileName);
        if (saved) {
          alert(`✅ Photo saved as "186-days-progress/${fileName}"`);
        } else {
          // Fallback to download
          downloadPhoto(base64String, fileName);
          alert(`✅ Photo downloaded as ${fileName} (Folder save failed)`);
        }
      } else {
        // No folder selected, use download
        downloadPhoto(base64String, fileName);
        alert(`✅ Photo downloaded as ${fileName}`);
      }
      
      // Save preview
      setPreview(base64String);
      
      // Also save to localStorage for gallery
      const existingPhotos = JSON.parse(localStorage.getItem("gymProgressPhotos") || "{}");
      const updatedPhotos = {
        ...existingPhotos,
        [`day${dayNumber}`]: {
          data: base64String,
          timestamp: new Date().toISOString(),
          day: dayNumber,
          fileName: fileName,
          folder: '186-days-progress'
        }
      };
      localStorage.setItem("gymProgressPhotos", JSON.stringify(updatedPhotos));
      
      if (onPhotoUploaded) {
        onPhotoUploaded(dayNumber, base64String);
      }
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="gym-photo-upload">
      <div className="photo-upload-header">
        <span className="photo-icon">📸</span>
        <h4>Day {dayNumber} Progress Photo</h4>
      </div>

      {/* Folder Selection UI */}
      {!folderSelected ? (
        <div className="folder-select-section">
          <p className="folder-info">📁 Photos will save in "186-days-progress" folder</p>
          <button onClick={selectFolder} className="folder-select-btn">
            📂 Select/Create Folder
          </button>
          <p className="folder-hint">(You can create new folder named "186-days-progress")</p>
        </div>
      ) : (
        <div className="folder-selected-badge">
          ✅ Folder: 186-days-progress
        </div>
      )}

      {/* Photo Upload UI */}
      {preview ? (
        <div className="photo-preview">
          <img src={preview} alt={`Day ${dayNumber}`} />
          <p className="photo-saved">
            ✅ Saved as 186-days-progress/day-{dayNumber}.jpg
          </p>
          <button 
            className="change-photo-btn"
            onClick={() => setPreview(null)}
          >
            🔄 Change Photo
          </button>
        </div>
      ) : (
        <div className="photo-upload-area">
          <label htmlFor={`photo-${dayNumber}`} className="upload-label">
            <span className="upload-icon">📤</span>
            <span>Click to select photo</span>
            <span className="upload-hint">
              Will save in 186-days-progress as day-{dayNumber}.jpg
            </span>
          </label>
          <input
            type="file"
            id={`photo-${dayNumber}`}
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>
      )}

      <style jsx>{`
        .gym-photo-upload {
          margin: 15px 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
          border-radius: 20px;
          border: 2px dashed #667eea;
        }
        
        .photo-upload-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .photo-icon {
          font-size: 24px;
        }
        
        .photo-upload-header h4 {
          margin: 0;
          color: #333;
        }
        
        .app.dark .photo-upload-header h4 {
          color: white;
        }
        
        /* Folder Selection Styles */
        .folder-select-section {
          background: #f0f0f0;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .app.dark .folder-select-section {
          background: #3a3a3a;
        }
        
        .folder-info {
          color: #667eea;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .folder-select-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 10px;
        }
        
        .folder-select-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(102,126,234,0.4);
        }
        
        .folder-hint {
          font-size: 11px;
          color: #666;
          margin: 0;
        }
        
        .folder-selected-badge {
          background: #4caf50;
          color: white;
          padding: 10px;
          border-radius: 30px;
          text-align: center;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          background: white;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .app.dark .upload-label {
          background: #2a2a2a;
        }
        
        .upload-label:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(102,126,234,0.2);
        }
        
        .upload-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }
        
        .upload-hint {
          font-size: 11px;
          color: #666;
          margin-top: 5px;
        }
        
        .photo-preview {
          text-align: center;
        }
        
        .photo-preview img {
          max-width: 100%;
          max-height: 200px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          margin-bottom: 10px;
        }
        
        .photo-saved {
          background: #4caf50;
          color: white;
          padding: 8px 15px;
          border-radius: 30px;
          font-size: 12px;
          display: inline-block;
          margin-bottom: 10px;
        }
        
        .change-photo-btn {
          background: #f0f0f0;
          border: none;
          padding: 8px 20px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .change-photo-btn:hover {
          background: #667eea;
          color: white;
        }
      `}</style>
    </div>
  );
}