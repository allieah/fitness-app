import { useEffect, useState } from "react";
import { useAuth, uploadFile } from "./firebase";

export default function Profile() {
  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  const [isInputVisible, setIsInputVisible] = useState(false);

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function handleClick() {
    uploadFile(photo, currentUser, setLoading);
    setIsInputVisible(false);
  }

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  return (
    <div>
      <img
        src={photoURL}
        // alt="Avatar"
        className="avatar"
        onClick={() => setIsInputVisible(true)}
      />

      {isInputVisible && (
        <div className="display">
          <input type="file" onChange={handleChange} />
          <button disabled={loading || !photo} onClick={handleClick}>
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
