import { memo } from 'react';
import { useOnlineStatus } from '../../lib/useOnlineStatus';

const OfflineBanner = memo(function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-amber-950 text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
      <span className="material-symbols-outlined text-[16px]">cloud_off</span>
      Mode offline — menampilkan data dari cache
    </div>
  );
});

export default OfflineBanner;
