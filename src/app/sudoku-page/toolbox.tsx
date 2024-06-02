export default function Toolbox() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    }}>
      { ['1','2','3','4','5','6','7','8','9'].map(el =>
        <div
          onClick={() => console.log('write')}
        >
          <p style={{
            fontSize: '40px',
          }}>
            {el}
          </p>
        </div>
      )
      }
    </div>
  )
}