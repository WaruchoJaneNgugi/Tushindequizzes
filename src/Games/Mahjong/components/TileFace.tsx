import type { TileType } from '../types';
import { cn } from '../lib/utils';

export const TileFace = ({ type }: { type: TileType }) => {
  if (!type) return null;
  
  if (type.suit === 'circles') {
    return <Circles value={type.value} />;
  }
  if (type.suit === 'bamboos') {
    if (type.value === 1) {
      return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full mahjong-tf-text-4xl">🦚</div>; // Bird for 1 Bamboo
    }
    return <Bamboos value={type.value} />;
  }
  if (type.suit === 'characters') {
    const chars = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return (
      <div className="mahjong-tf-flex-col mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full mahjong-tf-font-serif">
        <div className="mahjong-tf-text-lg mahjong-tf-font-bold mahjong-tf-text-slate-800 mahjong-tf-leading-none mahjong-tf-mb-1">{chars[type.value - 1]}</div>
        <div className="mahjong-tf-text-3xl mahjong-tf-font-bold mahjong-tf-text-red-600 mahjong-tf-leading-none">萬</div>
      </div>
    );
  }
  if (type.suit === 'winds') {
    const winds = ['東', '南', '西', '北']; // East, South, West, North
    return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full mahjong-tf-text-4xl mahjong-tf-font-serif mahjong-tf-font-bold mahjong-tf-text-slate-800">{winds[type.value - 1]}</div>;
  }
  if (type.suit === 'dragons') {
    if (type.value === 1) return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full mahjong-tf-text-4xl mahjong-tf-font-serif mahjong-tf-font-bold mahjong-tf-text-red-600">中</div>; // Red
    if (type.value === 2) return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full mahjong-tf-text-4xl mahjong-tf-font-serif mahjong-tf-font-bold mahjong-tf-text-green-600">發</div>; // Green
    if (type.value === 3) return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full"><div className="mahjong-tf-dragon-white"></div></div>; // White
  }
  if (type.suit === 'flowers') {
    const flowers = ['🌸', '🌺', '🌻', '🌹'];
    return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full mahjong-tf-text-4xl">{flowers[type.value - 1]}</div>;
  }
  if (type.suit === 'seasons') {
    const seasons = ['🌱', '☀️', '🍂', '❄️'];
    return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full mahjong-tf-text-4xl">{seasons[type.value - 1]}</div>;
  }
  return null;
};

const Circles = ({ value }: { value: number }) => {
  const renderCircle = (color: string, key: number) => (
    <div key={key} className={cn("mahjong-tf-circle", color)} />
  );

  const getCircles = () => {
    const red = "mahjong-tf-circle-red";
    const blue = "mahjong-tf-circle-blue";
    const green = "mahjong-tf-circle-green";

    switch (value) {
      case 1: return <div className="mahjong-tf-circle-large"><div className="mahjong-tf-circle-inner" /></div>;
      case 2: return <div className="mahjong-tf-flex-col mahjong-tf-gap-1-5">{[green, blue].map((c, i) => renderCircle(c, i))}</div>;
      case 3: return <div className="mahjong-tf-flex-col mahjong-tf-gap-1 mahjong-tf-rotate-45">{[blue, red, green].map((c, i) => renderCircle(c, i))}</div>;
      case 4: return <div className="mahjong-tf-grid mahjong-tf-grid-cols-2 mahjong-tf-gap-1-5">{[blue, green, green, blue].map((c, i) => renderCircle(c, i))}</div>;
      case 5: return (
        <div className="mahjong-tf-relative" style={{ width: '3rem', height: '3rem' }}>
          <div className="mahjong-tf-absolute mahjong-tf-top-0 mahjong-tf-left-0">{renderCircle(blue, 1)}</div>
          <div className="mahjong-tf-absolute mahjong-tf-top-0 mahjong-tf-right-0">{renderCircle(green, 2)}</div>
          <div className="mahjong-tf-absolute mahjong-tf-top-half mahjong-tf-left-half mahjong-tf-translate-center">{renderCircle(red, 3)}</div>
          <div className="mahjong-tf-absolute mahjong-tf-bottom-0 mahjong-tf-left-0">{renderCircle(green, 4)}</div>
          <div className="mahjong-tf-absolute mahjong-tf-bottom-0 mahjong-tf-right-0">{renderCircle(blue, 5)}</div>
        </div>
      );
      case 6: return <div className="mahjong-tf-grid mahjong-tf-grid-cols-2 mahjong-tf-gap-x-1-5 mahjong-tf-gap-y-1">{[green, green, red, red, red, red].map((c, i) => renderCircle(c, i))}</div>;
      case 7: return (
        <div className="mahjong-tf-flex-col mahjong-tf-items-center mahjong-tf-gap-1">
          <div className="mahjong-tf-flex mahjong-tf-gap-1 mahjong-tf-rotate-45">{[green, green, green].map((c, i) => renderCircle(c, i))}</div>
          <div className="mahjong-tf-grid mahjong-tf-grid-cols-2 mahjong-tf-gap-x-1-5 mahjong-tf-gap-y-1">{[red, red, red, red].map((c, i) => renderCircle(c, i+3))}</div>
        </div>
      );
      case 8: return <div className="mahjong-tf-grid mahjong-tf-grid-cols-2 mahjong-tf-gap-x-1-5 mahjong-tf-gap-y-1">{Array(8).fill(blue).map((c, i) => renderCircle(c, i))}</div>;
      case 9: return <div className="mahjong-tf-grid mahjong-tf-grid-cols-3 mahjong-tf-gap-1">{[...Array(3).fill(green), ...Array(3).fill(red), ...Array(3).fill(blue)].map((c, i) => renderCircle(c, i))}</div>;
    }
  };

  return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full">{getCircles()}</div>;
};

const Bamboos = ({ value }: { value: number }) => {
  const renderBamboo = (color: string, key: number) => (
    <div key={key} className={cn("mahjong-tf-bamboo", color)} />
  );

  const getBamboos = () => {
    const green = "mahjong-tf-bamboo-green";
    const blue = "mahjong-tf-bamboo-blue";
    const red = "mahjong-tf-bamboo-red";

    switch (value) {
      case 2: return <div className="mahjong-tf-flex-col mahjong-tf-gap-1-5">{[blue, green].map((c, i) => renderBamboo(c, i))}</div>;
      case 3: return (
        <div className="mahjong-tf-flex-col mahjong-tf-items-center mahjong-tf-gap-1">
          {renderBamboo(blue, 1)}
          <div className="mahjong-tf-flex mahjong-tf-gap-1-5">{[green, green].map((c, i) => renderBamboo(c, i+1))}</div>
        </div>
      );
      case 4: return <div className="mahjong-tf-grid mahjong-tf-grid-cols-2 mahjong-tf-gap-1-5">{[blue, green, green, blue].map((c, i) => renderBamboo(c, i))}</div>;
      case 5: return (
        <div className="mahjong-tf-relative" style={{ width: '2rem', height: '3rem' }}>
          <div className="mahjong-tf-absolute mahjong-tf-top-0 mahjong-tf-left-0">{renderBamboo(green, 1)}</div>
          <div className="mahjong-tf-absolute mahjong-tf-top-0 mahjong-tf-right-0">{renderBamboo(blue, 2)}</div>
          <div className="mahjong-tf-absolute mahjong-tf-top-half mahjong-tf-left-half mahjong-tf-translate-center">{renderBamboo(red, 3)}</div>
          <div className="mahjong-tf-absolute mahjong-tf-bottom-0 mahjong-tf-left-0">{renderBamboo(blue, 4)}</div>
          <div className="mahjong-tf-absolute mahjong-tf-bottom-0 mahjong-tf-right-0">{renderBamboo(green, 5)}</div>
        </div>
      );
      case 6: return <div className="mahjong-tf-grid mahjong-tf-grid-cols-3 mahjong-tf-gap-1-5">{Array(6).fill(green).map((c, i) => renderBamboo(c, i))}</div>;
      case 7: return (
        <div className="mahjong-tf-flex-col mahjong-tf-items-center mahjong-tf-gap-1">
          {renderBamboo(red, 1)}
          <div className="mahjong-tf-grid mahjong-tf-grid-cols-3 mahjong-tf-gap-1-5">{Array(6).fill(green).map((c, i) => renderBamboo(c, i+1))}</div>
        </div>
      );
      case 8: return (
        <div className="mahjong-tf-flex-col mahjong-tf-gap-1">
          <div className="mahjong-tf-grid mahjong-tf-grid-cols-4 mahjong-tf-gap-1">{Array(4).fill(green).map((c, i) => renderBamboo(c, i))}</div>
          <div className="mahjong-tf-grid mahjong-tf-grid-cols-4 mahjong-tf-gap-1">{Array(4).fill(blue).map((c, i) => renderBamboo(c, i+4))}</div>
        </div>
      );
      case 9: return <div className="mahjong-tf-grid mahjong-tf-grid-cols-3 mahjong-tf-gap-x-1-5 mahjong-tf-gap-y-1">{[...Array(3).fill(red), ...Array(3).fill(blue), ...Array(3).fill(green)].map((c, i) => renderBamboo(c, i))}</div>;
    }
  };

  return <div className="mahjong-tf-flex mahjong-tf-items-center mahjong-tf-justify-center mahjong-tf-w-full mahjong-tf-h-full">{getBamboos()}</div>;
};
