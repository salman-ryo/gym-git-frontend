const fs = require('fs');
const path = require('path');
const React = require('react');
const { ImageResponse } = require('next/og');

async function generateOgImage() {
  const rows = [
    [0, 1, 2, 3, 2, 4, 3, 2, 4, 3, 1, 4, 2, 3, 4, 2],
    [1, 2, 0, 4, 3, 2, 4, 1, 3, 4, 2, 3, 4, 1, 3, 4],
    [3, 4, 2, 1, 4, 3, 2, 4, 2, 1, 4, 3, 2, 4, 4, 3],
    [2, 0, 3, 4, 2, 4, 3, 1, 4, 2, 3, 4, 1, 3, 2, 4],
    [4, 3, 2, 4, 1, 3, 4, 2, 4, 3, 2, 4, 3, 2, 4, 4],
  ];

  const cellColors = {
    0: 'rgba(255, 255, 255, 0.05)',
    1: '#0e4429',
    2: '#006d32',
    3: '#26a641',
    4: '#00ff88',
  };

  const element = React.createElement(
    'div',
    {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 70px',
        backgroundColor: '#030108',
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(0, 255, 136, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(0, 224, 255, 0.18) 0%, transparent 45%)',
        fontFamily: 'sans-serif',
        color: '#ffffff',
      },
    },
    // Top bar: Badge & Brand
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#00ff88',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 255, 136, 0.6)',
            },
          },
          React.createElement(
            'div',
            {
              style: {
                fontSize: '32px',
                fontWeight: 900,
                color: '#030108',
                display: 'flex',
              },
            },
            'G'
          )
        ),
        React.createElement(
          'div',
          {
            style: {
              fontSize: '36px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #00ff88, #00e0ff)',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
            },
          },
          'Gym-Git'
        )
      ),
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 22px',
            borderRadius: '999px',
            border: '1px solid rgba(0, 255, 136, 0.4)',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            color: '#00ff88',
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          },
        },
        'TRACK YOUR GRIND'
      )
    ),
    // Center: Title & Subtitle
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginTop: '10px',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '56px',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#ffffff',
          },
        },
        React.createElement('span', { style: { display: 'flex' } }, 'Track Your Fitness'),
        React.createElement(
          'span',
          {
            style: {
              display: 'flex',
              background: 'linear-gradient(90deg, #00ff88, #00e0ff)',
              backgroundClip: 'text',
              color: 'transparent',
            },
          },
          'Like a Developer.'
        )
      ),
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: '22px',
            color: '#a1a1aa',
            maxWidth: '900px',
            lineHeight: 1.45,
          },
        },
        'GitHub-style contribution heatmaps, streak analytics, and RPG power progression. Commit to your workouts every single day.'
      )
    ),
    // Bottom: Mock Heatmap Graphic + Key stats
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '22px 28px',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgba(10, 15, 22, 0.85)',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          },
        },
        rows.map((row, rIdx) =>
          React.createElement(
            'div',
            { key: rIdx, style: { display: 'flex', gap: '6px' } },
            row.map((val, cIdx) =>
              React.createElement('div', {
                key: cIdx,
                style: {
                  width: '15px',
                  height: '15px',
                  borderRadius: '3px',
                  backgroundColor: cellColors[val],
                  boxShadow: val === 4 ? '0 0 8px rgba(0, 255, 136, 0.5)' : 'none',
                },
              })
            )
          )
        )
      ),
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            gap: '36px',
          },
        },
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column' } },
          React.createElement(
            'div',
            { style: { display: 'flex', fontSize: '13px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em' } },
            'Current Streak'
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', fontSize: '28px', fontWeight: 800, color: '#00ff88' } },
            '42 Days 🔥'
          )
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column' } },
          React.createElement(
            'div',
            { style: { display: 'flex', fontSize: '13px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em' } },
            'Power Level'
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', fontSize: '28px', fontWeight: 800, color: '#00e0ff' } },
            'Lvl 28 ⚡'
          )
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column' } },
          React.createElement(
            'div',
            { style: { display: 'flex', fontSize: '13px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em' } },
            'Total Commits'
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', fontSize: '28px', fontWeight: 800, color: '#ffffff' } },
            '186 Sessions'
          )
        )
      )
    )
  );

  const imageResponse = new ImageResponse(element, {
    width: 1200,
    height: 630,
  });

  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const publicOgPath = path.join(process.cwd(), 'public', 'opengraph-image.png');
  const publicTwitterPath = path.join(process.cwd(), 'public', 'twitter-image.png');

  fs.writeFileSync(publicOgPath, buffer);
  fs.writeFileSync(publicTwitterPath, buffer);

  console.log('Successfully generated:');
  console.log('- public/opengraph-image.png (' + buffer.length + ' bytes)');
  console.log('- public/twitter-image.png (' + buffer.length + ' bytes)');
}

generateOgImage().catch((err) => {
  console.error('Error generating OG image:', err);
  process.exit(1);
});

