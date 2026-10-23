/* =========================================================
   OrbitFAB — Floating Action Button for ORBIT Shopping Copilot
   ========================================================= */
import { useApp } from '../context/AppContext.jsx';
import './Orbit.css';

export default function OrbitFAB() {
  const { toggleOrbit, orbitOpen } = useApp();

  return (
    <button
      className={`orbit-fab ${orbitOpen ? 'active' : ''}`}
      onClick={toggleOrbit}
      aria-label="Toggle ORBIT shopping copilot"
      title="ORBIT Cross-Department Copilot"
      id="orbit-trigger-fab"
    >
      <div className="orbit-fab-rings">
        <span className="orbit-fab-ring ring-1"></span>
        <span className="orbit-fab-ring ring-2"></span>
      </div>
      <span className="orbit-fab-core">◈</span>
      <span className="orbit-fab-tooltip">Launch ORBIT AI</span>
    </button>
  );
}
