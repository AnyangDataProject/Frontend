export function useCurrentLocation() {
  const requestLocation = ({ onSuccess, onUnsupported, onError } = {}) => {
    if (!navigator.geolocation) {
      onUnsupported?.();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => onSuccess?.(position.coords),
      () => onError?.()
    );
  };

  return { requestLocation };
}
