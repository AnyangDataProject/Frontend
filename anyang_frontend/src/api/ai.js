async function urlToFile(imageUrl, filename = "photo.jpg") {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export async function analyzeReportImage(photoUrl) {
  if (!photoUrl) return null;

  const file = await urlToFile(photoUrl);

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("AI 분석 요청 실패");
  }

  const data = await response.json();

  const confidences = (data.detections ?? []).map((d) => d.confidence);
  const maxConfidence =
    confidences.length > 0 ? Math.max(...confidences) * 100 : null;

  return {
    detections: data.detections ?? [],
    resultImage: data.resultImage ?? null,
    confidence: maxConfidence,
  };
}