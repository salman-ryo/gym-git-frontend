import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Gym-Git — GitHub-Style Gym Attendance Tracker';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Commit cells sample pattern (5 rows x 16 cols)
  const rows = [
    [0, 1, 2, 3, 2, 4, 3, 2, 4, 3, 1, 4, 2, 3, 4, 2],
    [1, 2, 0, 4, 3, 2, 4, 1, 3, 4, 2, 3, 4, 1, 3, 4],
    [3, 4, 2, 1, 4, 3, 2, 4, 2, 1, 4, 3, 2, 4, 4, 3],
    [2, 0, 3, 4, 2, 4, 3, 1, 4, 2, 3, 4, 1, 3, 2, 4],
    [4, 3, 2, 4, 1, 3, 4, 2, 4, 3, 2, 4, 3, 2, 4, 4],
  ];

  const cellColors: Record<number, string> = {
    0: 'rgba(255, 255, 255, 0.05)',
    1: '#0e4429',
    2: '#006d32',
    3: '#26a641',
    4: '#00ff88',
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          backgroundColor: '#030108',
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(0, 255, 136, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(0, 224, 255, 0.15) 0%, transparent 45%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Top bar: Badge & Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#00ff88',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#030108',
                }}
              >
                G
              </div>
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #00ff88, #00e0ff)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Gym-Git
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              backgroundColor: 'rgba(0, 255, 136, 0.08)',
              color: '#00ff88',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            TRACK YOUR GRIND
          </div>
        </div>

        {/* Center: Title & Subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              fontSize: '54px',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            Track Your Fitness{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #00ff88, #00e0ff)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Like a Developer.
            </span>
          </div>

          <div
            style={{
              fontSize: '22px',
              color: '#a1a1aa',
              maxWidth: '850px',
              lineHeight: 1.4,
            }}
          >
            GitHub-style contribution heatmaps, streak analytics, and RPG power progression. Commit to your workouts every single day.
          </div>
        </div>

        {/* Bottom: Mock Heatmap Graphic + Key stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(10, 15, 22, 0.7)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            {rows.map((row, rIdx) => (
              <div key={rIdx} style={{ display: 'flex', gap: '5px' }}>
                {row.map((val, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      backgroundColor: cellColors[val],
                      boxShadow: val === 4 ? '0 0 6px rgba(0, 255, 136, 0.4)' : 'none',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '32px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '13px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Streak</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#00ff88' }}>42 Days 🔥</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '13px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Power Level</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#00e0ff' }}>Lvl 28 ⚡</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '13px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Commits</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>186 Sessions</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
