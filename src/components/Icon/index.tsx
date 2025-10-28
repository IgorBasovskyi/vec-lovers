import { TIconSVG } from '@/types/icon/general';
import { sanitizeSVG } from '@/utils/sanitize';

interface IconProps {
  svgIcon: TIconSVG;
}

const Icon = async ({ svgIcon }: IconProps) => {
  const safeSVG = sanitizeSVG(svgIcon);

  return <div dangerouslySetInnerHTML={{ __html: safeSVG }} />;
};

export default Icon;
