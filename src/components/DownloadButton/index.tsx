'use client';

import { Download } from 'lucide-react';
import { Button } from '../ui/button';

interface DownloadButtonProps {
  svgIcon: string | React.ReactNode;
  title: string;
}

const DownloadButton = ({ svgIcon, title }: DownloadButtonProps) => {
  const handleDownload = () => {
    if (typeof svgIcon === 'string') {
      const blob = new Blob([svgIcon], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    }
    // Note: Download only works for SVG string content
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDownload}>
      <Download className="w-4 h-4" />
    </Button>
  );
};

export default DownloadButton;
