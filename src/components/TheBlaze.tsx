import type { BlazeState } from '../types';

interface TheBlazeProps {
  state: BlazeState;
  contrastMargin?: number; // -1.0 to 1.0 evidence
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

/**
 * The Blaze: Trail-marker verification element.
 * Fills vertically based on empirical evidence, reflecting actual inference state.
 */
export const TheBlaze: React.FC<TheBlazeProps> = ({
  state,
  contrastMargin = 0,
  size = 'md',
  showLabel = true,
}) => {
  // Dimensions for standard trail marker proportions (2:3 aspect ratio)
  const dimensions = {
    sm: { width: 32, height: 48, stroke: 2, fontSize: '0.75rem' },
    md: { width: 44, height: 66, stroke: 3, fontSize: '0.875rem' },
    lg: { width: 64, height: 96, stroke: 4, fontSize: '1rem' },
  }[size];

  // Calculate fill height based on state and measured contrast margin
  let fillPercentage = 0;
  let statusText = 'Waiting for proof';
  let fillColor = 'var(--blaze)';
  let borderColor = 'var(--ink)';

  switch (state) {
    case 'idle':
      fillPercentage = 0;
      statusText = 'Ready for photograph';
      break;
    case 'loading_model':
      fillPercentage = 25;
      fillColor = 'var(--dusk)';
      statusText = 'Preparing vision model...';
      break;
    case 'analyzing':
      // Solid steady state representing analyzing without fake progress
      fillPercentage = 50;
      fillColor = 'var(--dusk)';
      statusText = 'Evaluating evidence...';
      break;
    case 'likely_match':
      // Bound between 60% and 85%
      fillPercentage = Math.min(85, Math.max(60, 50 + Math.round(contrastMargin * 35)));
      statusText = 'Evidence rising';
      break;
    case 'match':
      fillPercentage = 100;
      fillColor = 'var(--moss)';
      statusText = 'Verified Match!';
      break;
    case 'try_again':
      fillPercentage = 15;
      fillColor = 'var(--blaze-dark)';
      statusText = 'Keep looking';
      break;
    case 'uncertain':
      fillPercentage = 45;
      fillColor = 'var(--dusk)';
      statusText = 'Inconclusive light';
      break;
    case 'error':
      fillPercentage = 0;
      borderColor = 'var(--blaze-dark)';
      statusText = 'Inference unavailable';
      break;
  }

  return (
    <div className="flex flex-col items-center gap-2.5" role="status" aria-label={`The Blaze status: ${statusText}`}>
      {/* 3D Dimensional Trail Marker Plate */}
      <div
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          border: `${dimensions.stroke}px solid ${borderColor}`,
          borderBottom: `${dimensions.stroke + 2}px solid #0D140D`,
          borderRadius: '6px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#FFFDF8',
          boxShadow: '0 6px 14px rgba(31, 42, 31, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 3px rgba(0,0,0,0.1)',
        }}
        className="blaze-plate transition-colors duration-200"
      >
        {/* Subtle top mounting brass rivet */}
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: '#8C7752',
            boxShadow: '0 1px 1px rgba(0,0,0,0.4)',
            zIndex: 10,
          }}
        />

        {/* Fill level representing empirical evidence (GPU accelerated scaleY) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            transform: `scaleY(${fillPercentage / 100})`,
            transformOrigin: 'bottom',
            backgroundColor: fillColor,
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.4)',
            transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease',
          }}
        />

        {/* Trail marker horizontal center guide line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1.5px',
            backgroundColor: 'rgba(31, 42, 31, 0.25)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />

        {/* Bottom mounting brass rivet */}
        <div
          style={{
            position: 'absolute',
            bottom: '3px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: '#8C7752',
            boxShadow: '0 1px 1px rgba(0,0,0,0.4)',
            zIndex: 10,
          }}
        />
      </div>

      {showLabel && (
        <span
          className="font-bold tracking-tight px-2.5 py-0.5 rounded-full text-xs"
          style={{
            fontSize: dimensions.fontSize,
            color: state === 'match' ? 'var(--moss)' : 'var(--ink)',
            backgroundColor: state === 'match' ? 'var(--moss-subtle)' : 'var(--paper-subtle)',
            border: `1px solid ${state === 'match' ? 'var(--moss)' : 'var(--border)'}`,
            boxShadow: '0 1px 2px rgba(31, 42, 31, 0.05)',
          }}
        >
          {statusText}
        </span>
      )}
    </div>
  );
};
