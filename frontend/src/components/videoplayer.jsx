export default function VideoPlayer({ videoUrl, onComplete }) {
  return (
    <video
      width="800"
      controls
      onEnded={onComplete}
      style={{ marginTop: 20 }}
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
