import React from 'react';
import { Composition } from 'remotion';
import { ChessCareerVideo } from './ChessCareerVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChessCareerVideo"
        component={ChessCareerVideo}
        durationInFrames={600} // 20 seconds at 30 fps covering all 7 menus
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          username: 'Pa_ra-m',
          rapidPeak: 1152,
          blitzPeak: 880,
          totalGames: 3423,
          isDark: true,
        }}
      />
    </>
  );
};

