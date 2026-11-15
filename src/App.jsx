import { useState } from 'react'
import './App.css'

const courts = [
  'Cancha 1',
  'Cancha 2',
  'Cancha 3',
  'Cancha 4',
]

const timeSlots = Array.from({ length: 24 }, (_, hour) => {
  return `${String(hour).padStart(2, '0')}:00`
})

const initialReservations = [
  {
    code: 'FTX-2026-001',
    customer: 'Usuario de demostración',
    email: 'usuario@ejemplo.com',
    phone: '3000000000',
    court: 'Cancha 1',
    date: '2026-11-16',
    time: '09:00',
    status: 'CONFIRMED',
  },
  {
    code: 'FTX-2026-002',
    customer: 'Cliente de demostración',
    email: 'cliente@ejemplo.com',
    phone: '3000000001',
    court: 'Cancha 2',
    date: '2026-11-17',
    time: '15:00',
    status: 'PENDING',
  },
]

const statusLabels = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  REJECTED: 'Rechazada',
}

function getToday() {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

function App() {
  const [reservations, setReservations] = useState(initialReservations)
  const [form, setForm] = useState({
    customer: '',
    email: '',
    phone: '',
    court: '',
    date: '',
    time: '',
  })
  const [lookupCode, setLookupCode] = useState('')
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupMessage, setLookupMessage] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [activeSection, setActiveSection] = useState('reservar')

  const pendingCount = reservations.filter(
    (item) => item.status === 'PENDING',
  ).length

  const confirmedCount = reservations.filter(
    (item) => item.status === 'CONFIRMED',
  ).length

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const code = `FTX-${Date.now().toString().slice(-8)}`

    const newReservation = {
      ...form,
      code,
      status: 'PENDING',
    }

    setReservations((current) => [newReservation, ...current])
    setCreatedCode(code)
    setLookupCode(code)
    setLookupResult(newReservation)
    setLookupMessage('')
    setForm({
      customer: '',
      email: '',
      phone: '',
      court: '',
      date: '',
      time: '',
    })
    setActiveSection('consultar')
  }

  function handleLookup(event) {
    event.preventDefault()

    const normalizedCode = lookupCode.trim().toUpperCase()

    const result = reservations.find(
      (item) => item.code.toUpperCase() === normalizedCode,
    )

    setLookupResult(result || null)
    setLookupMessage(
      result
        ? ''
        : 'No encontramos una reserva con ese código. Verifique e intente nuevamente.',
    )
    setCreatedCode('')
  }

  function openSection(section) {
    setActiveSection(section)
    setCreatedCode('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#inicio">
          <span className="brand-mark">F</span>
          <span>
            <strong>FUTBOLIX</strong>
            <small>RESERVATIONS</small>
          </span>
        </a>

        <div className="navigation">
          <span className="nav-label">RESERVAS</span>

          <button
            className={`nav-item ${activeSection === 'reservar' ? 'active' : ''}`}
            onClick={() => openSection('reservar')}
          >
            <span>＋</span>
            Nueva reserva
          </button>

          <button
            className={`nav-item ${activeSection === 'consultar' ? 'active' : ''}`}
            onClick={() => openSection('consultar')}
          >
            <span>⌕</span>
            Consultar reserva
          </button>
        </div>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Sistema en desarrollo
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <span>Futbolix / Reservas</span>
          <span className="environment">PORTAL DE RESERVAS</span>
        </header>

        <section className="page-heading">
          <p className="eyebrow">GESTIÓN DE CANCHAS DEPORTIVAS</p>
          <h1>Reservas Futbolix</h1>
          <p className="subtitle">
            Reserve una cancha y consulte el estado de su solicitud.
          </p>
        </section>

        <section className="welcome-card">
          <div>
            <span className="welcome-tag">BIENVENIDO A FUTBOLIX</span>
            <h2>Su próximo partido comienza aquí.</h2>
            <p>
              Seleccione una cancha, elija el horario y registre sus datos
              de contacto para solicitar una reserva.
            </p>
            <button
              className="hero-button"
              onClick={() => openSection('reservar')}
            >
              Reservar una cancha
            </button>
          </div>
          <div className="welcome-icon">⚽</div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <span className="stat-label">Canchas disponibles en el catálogo</span>
            <strong>4</strong>
            <span className="stat-description">Canchas iniciales</span>
          </article>

          <article className="stat-card">
            <span className="stat-label">Reservas pendientes</span>
            <strong>{pendingCount}</strong>
            <span className="stat-description">Solicitudes por gestionar</span>
          </article>

          <article className="stat-card">
            <span className="stat-label">Reservas confirmadas</span>
            <strong>{confirmedCount}</strong>
            <span className="stat-description">Reservas confirmadas</span>
          </article>
        </section>

        {activeSection === 'reservar' && (
          <section className="content-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">SOLICITUD</p>
                <h2>Reserve su cancha</h2>
                <p>Complete los datos para registrar su solicitud.</p>
              </div>
            </div>

            <form className="reservation-form" onSubmit={handleSubmit}>
              <div className="form-section-title">
                <span className="step-number">01</span>
                <div>
                  <h3>Datos de contacto</h3>
                  <p>Información de la persona que realiza la reserva.</p>
                </div>
              </div>

              <div className="form-grid">
                <label>
                  Nombre completo
                  <input
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    placeholder="Ingrese su nombre"
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  Correo electrónico
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label>
                  Teléfono de contacto
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Número de contacto"
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>

              <div className="form-section-title second-step">
                <span className="step-number">02</span>
                <div>
                  <h3>Detalles de la reserva</h3>
                  <p>Seleccione la cancha y el horario solicitado.</p>
                </div>
              </div>

              <div className="form-grid">
                <label>
                  Cancha
                  <select
                    name="court"
                    value={form.court}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una cancha</option>
                    {courts.map((court) => (
                      <option key={court} value={court}>
                        {court}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Fecha
                  <input
                    name="date"
                    type="date"
                    min={getToday()}
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Hora de inicio
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una hora</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <small className="field-hint">
                    Las reservas se solicitan en bloques de una hora.
                  </small>
                </label>
              </div>

              <div className="form-actions">
                <p>
                  La solicitud quedará pendiente hasta su confirmación.
                </p>
                <button className="primary-button" type="submit">
                  Solicitar reserva
                  <span>→</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {activeSection === 'consultar' && (
          <section className="content-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CONSULTA PÚBLICA</p>
                <h2>Consulte su reserva</h2>
                <p>
                  Ingrese el código que recibió al registrar su solicitud.
                </p>
              </div>
            </div>

            <form className="lookup-form" onSubmit={handleLookup}>
              <label htmlFor="lookup-code">Código de reserva</label>
              <div className="lookup-controls">
                <input
                  id="lookup-code"
                  value={lookupCode}
                  onChange={(event) => setLookupCode(event.target.value)}
                  placeholder="Ejemplo: FTX-2026-001"
                  required
                />
                <button className="primary-button" type="submit">
                  Consultar
                </button>
              </div>
            </form>

            {lookupMessage && (
              <div className="message message-error">{lookupMessage}</div>
            )}

            {createdCode && (
              <div className="message message-success">
                Su solicitud fue registrada. Guarde este código para consultar
                su reserva: <strong>{createdCode}</strong>
              </div>
            )}

            {lookupResult && (
              <div className="result-card">
                <div className="result-heading">
                  <div>
                    <span className="eyebrow">DETALLE DE RESERVA</span>
                    <h3>{lookupResult.code}</h3>
                  </div>
                  <StatusBadge status={lookupResult.status} />
                </div>

                <div className="result-grid">
                  <div>
                    <span>Solicitante</span>
                    <strong>{lookupResult.customer}</strong>
                  </div>
                  <div>
                    <span>Cancha</span>
                    <strong>{lookupResult.court}</strong>
                  </div>
                  <div>
                    <span>Fecha</span>
                    <strong>{lookupResult.date}</strong>
                  </div>
                  <div>
                    <span>Hora de inicio</span>
                    <strong>{lookupResult.time}</strong>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="page-footer">
          Futbolix · Reservations Portal
          <span>Interfaz de demostración · Integración pendiente</span>
        </footer>
      </main>
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      {statusLabels[status] || status}
    </span>
  )
}

export default App