const SERVICE_UNAVAILABLE_MESSAGE = "지도 서비스를 불러오는 중이에요. 잠시 후 다시 시도해주세요.";

export function useKakaoGeocoder() {
  const searchAddress = (text, { onSuccess, onError } = {}) => {
    if (!window.kakao?.maps?.services) {
      onError?.(SERVICE_UNAVAILABLE_MESSAGE);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(text, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        onSuccess?.({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
      } else {
        onError?.("주소를 찾을 수 없어요. 다르게 입력해보세요.");
      }
    });
  };

  const reverseGeocode = (lat, lng, { onSuccess, onError } = {}) => {
    if (!window.kakao?.maps?.services) {
      onError?.(SERVICE_UNAVAILABLE_MESSAGE);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const road = result[0]?.road_address?.address_name;
        const jibun = result[0]?.address?.address_name;
        if (road || jibun) {
          onSuccess?.(road || jibun);
        } else {
          onError?.("주소를 찾을 수 없습니다. 직접 입력해주세요.");
        }
      } else {
        onError?.("주소를 찾을 수 없습니다. 직접 입력해주세요.");
      }
    });
  };

  return { searchAddress, reverseGeocode };
}
