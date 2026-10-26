import { RetroAudio } from '../../game/audio/RetroAudio';

interface Props {
  onClose: () => void;
}

interface EnemyBestiaryCard {
  id: string;
  name: string;
  points: string;
  icon: string;
  headline: string;
  mechanics: string;
  howToBeat: string[];
  danger: string;
  tip?: string;
}

const enemyBestiary: EnemyBestiaryCard[] = [
  {
    id: 'sprout',
    name: 'SPROUT WALKER',
    points: '100 PTS',
    icon: '/assets/enemies/sprout.png',
    headline: 'Marches in a straight line. Stomp it flat.',
    mechanics: 'Walks at a steady 55 px/s, turns only at ledges and walls, and never chases. Falls off platforms it walks past.',
    howToBeat: [
      '> Stomp — flattens instantly',
      '> Fire ember — one hit',
      '> Sliding shell — knocked away',
    ],
    danger: 'Side contact costs one power stage. Small heroes die.',
    tip: 'Chain stomps without landing to build the 100 / 200 / 400 combo ladder.',
  },
  {
    id: 'bramble',
    name: 'BRAMBLE SHELL',
    points: '200 PTS',
    icon: '/assets/enemies/bramble.png',
    headline: 'Shelled patroller. Stomp once to shell it, then kick it into a crowd.',
    mechanics: 'Patrols at 52 px/s across a 125 px beat. First stomp tucks it into a dormant shell for 5.2 s.',
    howToBeat: [
      '> Stomp 1 — becomes a shell',
      '> Nudge a shell — kicks it at 400 px/s',
      '> Stomp a sliding shell — stops it dead',
      '> Fire ember — defeats it outright',
    ],
    danger: 'A sliding shell hurts you too, after a 140 ms grace window. Shells bounce off walls and return.',
    tip: 'Kick a shell down a lane of Sprout Walkers for a rapid score chain.',
  },
  {
    id: 'puffwing',
    name: 'PUFFWING',
    points: '150 PTS',
    icon: '/assets/enemies/puffwing.png',
    headline: 'Hovers in a wave pattern. Time your jump or use fire.',
    mechanics: 'Drifts at 60 px/s along a 160 px sine wave, ignoring the ground, so it crosses pits.',
    howToBeat: [
      '> Stomp at the bottom of its dip',
      '> Fire ember — safest option',
    ],
    danger: 'It can drift into you mid-jump, over pits where knockback means a fall.',
    tip: 'Stomp at the low point; the bounce carries you over the next gap.',
  },
  {
    id: 'emberjaw',
    name: 'EMBERJAW BLOOM',
    points: '250 PTS',
    icon: '/assets/enemies/emberjaw.png',
    headline: 'Bites out of pipes on a cycle. Cannot be stomped — fire only.',
    mechanics: 'Fixed NES cadence: 1.4 s hidden, 0.4 s rise, 2.0 s exposed, 0.4 s retract. Stays down while you stand on its rim.',
    howToBeat: [
      '> Fire ember — the only direct answer',
      '> A sliding shell into the pipe',
    ],
    danger: 'No weak point on the head — stomping always hurts.',
    tip: 'Stand on the rim to keep it down, or pass exactly on the retract beat.',
  },
  {
    id: 'spiker',
    name: 'CINDER SPIKER',
    points: '300 PTS',
    icon: '/assets/enemies/spiker.png',
    headline: 'Spiked roller that charges when it spots you. Never stompable.',
    mechanics: 'Rolls at 45 px/s. Within 260 px and in front, it winds up and charges at 2.6x speed for about a second.',
    howToBeat: [
      '> Fire ember — clean kill',
      '> Sliding shell — bowls it over',
      '> Jump clean over the charge',
    ],
    danger: 'Spikes cover the top, so a stomp always costs a power stage.',
    tip: 'Bait the charge from a ledge, then drop behind it while it overshoots.',
  },
];

export default function StageInspectorModal({ onClose }: Props) {
  return (
    <div className="retro-modal-backdrop" onClick={onClose}>
      <div
        className="retro-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '760px',
          maxWidth: '96%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#f4f5f8',
          fontFamily: "'Silkscreen', 'Press Start 2P', monospace",
        }}
      >
        {/* Header Bar */}
        <div className="retro-modal-header" style={{ marginBottom: 10 }}>
          <span className="retro-modal-title" style={{ fontSize: 13, color: '#000' }}>
            👾 ENEMY FIELD MANUAL & BESTIARY
          </span>
          <button
            className="retro-modal-close"
            onClick={() => {
              RetroAudio.playClick();
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        {/* 2-Column Grid of Cards matching user reference image */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 14 }}>
          {enemyBestiary.map((card) => (
            <div
              key={card.id}
              style={{
                backgroundColor: '#ffffff',
                border: '3px solid #000',
                boxShadow: '4px 4px 0px #000',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 8,
                lineHeight: '1.5',
              }}
            >
              {/* Card Header: Icon + Name + Points */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src={card.icon}
                    alt={card.name}
                    style={{ width: 24, height: 24, imageRendering: 'pixelated', objectFit: 'contain' }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 'bold', color: '#d84800' }}>{card.name}</span>
                </div>
                <span
                  style={{
                    backgroundColor: '#ffd000',
                    border: '2px solid #000',
                    padding: '2px 6px',
                    fontSize: 7,
                    fontWeight: 'bold',
                    color: '#000',
                  }}
                >
                  {card.points}
                </span>
              </div>

              {/* Headline & Mechanics */}
              <div style={{ fontWeight: 'bold', color: '#000' }}>{card.headline}</div>
              <div style={{ color: '#555', fontSize: 7 }}>{card.mechanics}</div>

              {/* How to Beat */}
              <div style={{ marginTop: 2 }}>
                <div style={{ color: '#d84800', fontWeight: 'bold', fontSize: 7 }}>HOW TO BEAT IT</div>
                {card.howToBeat.map((item, idx) => (
                  <div key={idx} style={{ color: '#222', fontSize: 7 }}>{item}</div>
                ))}
              </div>

              {/* Danger */}
              <div>
                <span style={{ color: '#e60012', fontWeight: 'bold', fontSize: 7 }}>DANGER: </span>
                <span style={{ color: '#333', fontSize: 7 }}>{card.danger}</span>
              </div>

              {/* Tip */}
              {card.tip && (
                <div style={{ backgroundColor: '#fffde7', border: '1px dashed #cca000', padding: 4 }}>
                  <span style={{ color: '#d84800', fontWeight: 'bold', fontSize: 7 }}>TIP: </span>
                  <span style={{ color: '#444', fontSize: 7 }}>{card.tip}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="retro-btn retro-btn-full"
          onClick={() => {
            RetroAudio.playClick();
            onClose();
          }}
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  );
}
