import React from 'react';
import { IconCheck, IconEye } from './icons';

export type PreviewFrame =
  | 'a4'
  | 'story'
  | 'feed'
  | 'square'
  | 'carousel'
  | 'hr-a4'
  | 'hr-social';

interface PreviewStageProps {
  frame: PreviewFrame;
  stack?: boolean;
  caption?: string;
  children: React.ReactNode;
}

export const PreviewStage: React.FC<PreviewStageProps> = ({
  frame,
  stack = false,
  caption,
  children,
}) => (
  <div className={`preview-stage${stack ? ' preview-stage--stack' : ''}`}>
    {!stack && <div className="stage-dots" aria-hidden="true" />}
    {stack ? (
      <div className="preview-stack-sheets">{children}</div>
    ) : (
      <div className={`creative-frame frame--${frame}`}>
        <span className="frame-corner frame-corner--tl" aria-hidden="true" />
        <span className="frame-corner frame-corner--tr" aria-hidden="true" />
        <span className="frame-corner frame-corner--bl" aria-hidden="true" />
        <span className="frame-corner frame-corner--br" aria-hidden="true" />
        {children}
      </div>
    )}
    {caption && (
      <div className="stage-caption">
        {caption}
      </div>
    )}
  </div>
);

export const PreviewSaveState: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span className="preview-save-state">
    <span className="save-check" aria-hidden="true">
      <IconCheck size={9} />
    </span>
    {children}
  </span>
);
