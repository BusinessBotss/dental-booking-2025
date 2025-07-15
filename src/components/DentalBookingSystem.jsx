/**
 * DentalBookingSystem.jsx – v1.2.1
 * ─────────────────────────────────
 * • Formulario de reservas dentales con validación.
 * • 5 idiomas (ES | EN | FR | DE | IT) sin recarga.
 * • Dashboard con búsqueda, filtros y borrado.
 * • Toast de confirmación al crear reserva.
 * • Fix Safari 16/17: <input type="time"> ya no crashea
 *   (usa value={preferredTime || undefined}).
 * • Email/Teléfono fluidos, sin “lag”.
 *
 * Requisitos:
 *   – React 18+
 *   – lucide-react
 */

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  CheckCircle,
  Search,
  Globe,
  Edit,
  Trash2,
} from "lucide-react";

/* ─────── Diccionarios (ES | EN | FR | DE | IT) ─────── */
const dictionaries = {
  ES: {
    flag: "🇪🇸",
    title: "Reservar Cita Dental",
    patientName: "Nombre del paciente",
    email: "Correo electrónico",
    phone: "Teléfono",
    treatment: "Tratamiento",
    urgency: "Urgencia",
    preferredDate: "Fecha preferida",
    preferredTime: "Hora preferida",
    medicalHistory: "Historial médico",
    notes: "Notas adicionales",
    submit: "Reservar",
    cancel: "Limpiar",
    required: "Obligatorio",
    emailInvalid: "Correo no válido",
    phoneInvalid: "Teléfono no válido",
    treatments: {
      limpieza: "Limpieza",
      caries: "Empaste / Caries",
      ortodoncia: "Ortodoncia",
      blanqueamiento: "Blanqueamiento",
    },
    urgencyLevels: {
      baja: "Baja",
      media: "Media",
      alta: "Alta",
      emergencia: "Emergencia",
    },
    dashboard: "Reservas",
    search: "Buscar…",
    all: "Todas",
    pending: "Pendiente",
    confirmed: "Confirmada",
    completed: "Completada",
    cancelled: "Cancelada",
    status: {
      pendiente: "Pendiente",
      confirmada: "Confirmada",
      completada: "Completada",
      cancelada: "Cancelada",
    },
    toastSuccess: "Reserva creada correctamente",
  },
  EN: {
    flag: "🇺🇸",
    title: "Book Dental Appointment",
    patientName: "Patient name",
    email: "Email",
    phone: "Phone",
    treatment: "Treatment",
    urgency: "Urgency",
    preferredDate: "Preferred date",
    preferredTime: "Preferred time",
    medicalHistory: "Medical history",
    notes: "Additional notes",
    submit: "Book",
    cancel: "Clear",
    required: "Required",
    emailInvalid: "Invalid email",
    phoneInvalid: "Invalid phone",
    treatments: {
      limpieza: "Cleaning",
      caries: "Filling / Caries",
      ortodoncia: "Orthodontics",
      blanqueamiento: "Whitening",
    },
    urgencyLevels: {
      baja: "Low",
      media: "Medium",
      alta: "High",
      emergencia: "Emergency",
    },
    dashboard: "Bookings",
    search: "Search…",
    all: "All",
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    status: {
      pendiente: "Pending",
      confirmada: "Confirmed",
      completada: "Completed",
      cancelada: "Cancelled",
    },
    toastSuccess: "Booking created successfully",
  },
  FR: {
    flag: "🇫🇷",
    title: "Prendre un Rendez-vous Dentaire",
    patientName: "Nom du patient",
    email: "E-mail",
    phone: "Téléphone",
    treatment: "Traitement",
    urgency: "Urgence",
    preferredDate: "Date préférée",
    preferredTime: "Heure préférée",
    medicalHistory: "Historique médical",
    notes: "Notes supplémentaires",
    submit: "Réserver",
    cancel: "Effacer",
    required: "Obligatoire",
    emailInvalid: "E-mail invalide",
    phoneInvalid: "Téléphone invalide",
    treatments: {
      limpieza: "Détartrage",
      caries: "Caries / Plombage",
      ortodoncia: "Orthodontie",
      blanqueamiento: "Blanchiment",
    },
    urgencyLevels: {
      baja: "Basse",
      media: "Moyenne",
      alta: "Élevée",
      emergencia: "Urgence",
    },
    dashboard: "Réservations",
    search: "Rechercher…",
    all: "Toutes",
    pending: "En attente",
    confirmed: "Confirmée",
    completed: "Terminée",
    cancelled: "Annulée",
    status: {
      pendiente: "En attente",
      confirmada: "Confirmée",
      completada: "Terminée",
      cancelada: "Annulée",
    },
    toastSuccess: "Réservation créée avec succès",
  },
  DE: {
    flag: "🇩🇪",
    title: "Zahnarzttermin Buchen",
    patientName: "Patientenname",
    email: "E-Mail",
    phone: "Telefon",
    treatment: "Behandlung",
    urgency: "Dringlichkeit",
    preferredDate: "Bevorzugtes Datum",
    preferredTime: "Bevorzugte Uhrzeit",
    medicalHistory: "Medizinische Vorgeschichte",
    notes: "Zusätzliche Notizen",
    submit: "Buchen",
    cancel: "Leeren",
    required: "Pflichtfeld",
    emailInvalid: "Ungültige E-Mail",
    phoneInvalid: "Ungültige Telefonnummer",
    treatments: {
      limpieza: "Reinigung",
      caries: "Füllung / Karies",
      ortodoncia: "Kieferorthopädie",
      blanqueamiento: "Bleaching",
    },
    urgencyLevels: {
      baja: "Niedrig",
      media: "Mittel",
      alta: "Hoch",
      emergencia: "Notfall",
    },
    dashboard: "Buchungen",
    search: "Suchen…",
    all: "Alle",
    pending: "Ausstehend",
    confirmed: "Bestätigt",
    completed: "Abgeschlossen",
    cancelled: "Abgesagt",
    status: {
      pendiente: "Ausstehend",
      confirmada: "Bestätigt",
      completada: "Abgeschlossen",
      cancelada: "Abgesagt",
    },
    toastSuccess: "Buchung erfolgreich erstellt",
  },
  IT: {
    flag: "🇮🇹",
    title: "Prenota Visita Dentistica",
    patientName: "Nome paziente",
    email: "E-mail",
    phone: "Telefono",
    treatment: "Trattamento",
    urgency: "Urgenza",
    preferredDate: "Data preferita",
    preferredTime: "Ora preferita",
    medicalHistory: "Storia medica",
    notes: "Note aggiuntive",
    submit: "Prenota",
    cancel: "Cancella",
    required: "Obbligatorio",
    emailInvalid: "E-mail non valida",
    phoneInvalid: "Telefono non valido",
    treatments: {
      limpieza: "Pulizia",
      caries: "Otturazione / Carie",
      ortodoncia: "Ortodonzia",
      blanqueamiento: "Sbiancamento",
    },
    urgencyLevels: {
      baja: "Bassa",
      media: "Media",
      alta: "Alta",
      emergencia: "Emergenza",
    },
    dashboard: "Prenotazioni",
    search: "Cerca…",
    all: "Tutte",
    pending: "In attesa",
    confirmed: "Confermata",
    completed: "Completata",
    cancelled: "Annullata",
    status: {
      pendiente: "In attesa",
      confirmada: "Confermata",
      completada: "Completata",
      cancelada: "Annullata",
    },
    toastSuccess: "Prenotazione creata con successo",
  },
};

/* ─────── Constantes ─────── */
const initialForm = {
  patientName: "",
  email: "",
  phone: "",
  treatment: "",
  urgency: "",
  preferredDate: "",
  preferredTime: "",
  medicalHistory: "",
  notes: "",
};

const colors = {
  urgency: {
    emergencia: "bg-red-500/10 text-red-400",
    alta: "bg-orange-500/10 text-orange-400",
    media: "bg-yellow-500/10 text-yellow-400",
    baja: "bg-green-500/10 text-green-400",
  },
  status: {
    pendiente: "bg-yellow-500/10 text-yellow-400",
    confirmada: "bg-blue-500/10 text-blue-400",
    completada: "bg-green-500/10 text-green-400",
    cancelada: "bg-red-500/10 text-red-400",
  },
};

/* ─────── Componente principal ─────── */
export default function DentalBookingSystem() {
  const [lang, setLang] = useState("ES");
  const [view, setView] = useState("booking"); // booking | dashboard
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(false);

  const T = dictionaries[lang];

  /* ─────── Validación ─────── */
  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = T.required;

    if (!form.email.trim()) {
      e.email = T.required;
    } else if (!/^[\w.+-]+@([\w-]+\.)+\w{2,}$/i.test(form.email)) {
      e.email = T.emailInvalid;
    }

    if (!form.phone.trim()) {
      e.phone = T.required;
    } else if (!/^[+]?\d{7,16}$/.test(form.phone.replace(/\s/g, ""))) {
      e.phone = T.phoneInvalid;
    }

    ["treatment", "urgency", "preferredDate", "preferredTime"].forEach((k) => {
      if (!form[k]) e[k] = T.required;
    });

    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ─────── Handlers ─────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBookings((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...form,
        status: "pendiente",
        createdAt: new Date().toISOString(),
      },
    ]);
    setForm({ ...initialForm });
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const removeBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  /* ─────── Filtros ─────── */
  const filtered = bookings.filter((b) => {
    const term = search.toLowerCase();
    const matchText =
      b.patientName.toLowerCase().includes(term) ||
      b.email.toLowerCase().includes(term);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchText && matchStatus;
  });

  /* ─────── Sub-componentes UI ─────── */
  const InputBlock = ({
    label,
    icon,
    type = "text",
    value,
    onChange,
    error,
  }) => (
    <div className="space-y-1">
      <label className="text-sm flex items-center gap-2 text-gray-300">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={type === "time" ? value || undefined : value} /* ← fix Safari */
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 rounded-lg bg-gray-900/50 border ${
          error ? "border-red-500" : "border-gray-700"
        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );

  const SelectBlock = ({ label, icon, value, onChange, options, error }) => (
    <div className="space-y-1">
      <label className="text-sm flex items-center gap-2 text-gray-300">
        {icon}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 rounded-lg bg-gray-900/50 border ${
          error ? "border-red-500" : "border-gray-700"
        } text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
      >
        <option value="">--</option>
        {Object.entries(options).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm break-all">{value}</p>
      </div>
    </div>
  );

  /* ─────── Booking Form ─────── */
  const BookingForm = () => (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-gray-900/30 border border-gray-700 rounded-2xl p-8 backdrop-blur"
    >
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        <Calendar className="h-6 w-6 text-pink-400" />
        {T.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputBlock
          label={T.patientName}
          icon={<User className="h-4 w-4" />}
          value={form.patientName}
          error={errors.patientName}
          onChange={(v) => setForm({ ...form, patientName: v })}
        />
        {/* E-mail — no controlado para evitar saltos en Safari */}
        <div className="space-y-1">
          <label className="text-sm flex items-center gap-2 text-gray-300">
            <Mail className="h-4 w-4" />
            {T.email}
          </label>

          <input
            type="text" /* ← usamos text, no email */
            name="email"
            inputMode="email" /* teclado email en mobile */
            autoComplete="email"
            defaultValue={form.email} /* valor inicial */
            onBlur={(e) => setForm({ ...form, email: e.target.value.trim() })}
            className={`w-full px-4 py-2 rounded-lg bg-gray-900/50 border ${
              errors.email ? "border-red-500" : "border-gray-700"
            } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
            placeholder="nombre@dominio.com"
          />

          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email}</p>
          )}
        </div>

        <InputBlock
          type="tel"
          label={T.phone}
          icon={<Phone className="h-4 w-4" />}
          value={form.phone}
          error={errors.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
        <SelectBlock
          label={T.treatment}
          icon={<FileText className="h-4 w-4" />}
          value={form.treatment}
          error={errors.treatment}
          options={T.treatments}
          onChange={(v) => setForm({ ...form, treatment: v })}
        />
        <SelectBlock
          label={T.urgency}
          icon={<AlertTriangle className="h-4 w-4" />}
          value={form.urgency}
          error={errors.urgency}
          options={T.urgencyLevels}
          onChange={(v) => setForm({ ...form, urgency: v })}
        />
        <InputBlock
          type="date"
          label={T.preferredDate}
          icon={<Calendar className="h-4 w-4" />}
          value={form.preferredDate}
          error={errors.preferredDate}
          onChange={(v) => setForm({ ...form, preferredDate: v })}
        />
        <div className="space-y-1">
          <label className="text-sm flex items-center gap-2 text-gray-300">
            <Clock className="h-4 w-4" />
            {T.preferredTime}
          </label>

          <input
            type="time"
            name="preferredTime"
            defaultValue={form.preferredTime}
            onBlur={(e) => setForm({ ...form, preferredTime: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg bg-gray-900/50 border ${
              errors.preferredTime ? "border-red-500" : "border-gray-700"
            } text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
          />

          {errors.preferredTime && (
            <p className="text-red-400 text-xs">{errors.preferredTime}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm flex items-center gap-2 text-gray-300">
          <FileText className="h-4 w-4" />
          {T.medicalHistory}
        </label>
        <textarea
          rows={2}
          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white"
          value={form.medicalHistory}
          onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
        />

        <label className="text-sm flex items-center gap-2 text-gray-300">
          <FileText className="h-4 w-4" />
          {T.notes}
        </label>
        <textarea
          rows={2}
          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:scale-105 transition-transform"
        >
          {T.submit}
        </button>
        <button
          type="button"
          onClick={() => {
            setForm({ ...initialForm });
            setErrors({});
          }}
          className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg"
        >
          {T.cancel}
        </button>
      </div>
    </form>
  );

  /* ─────── Dashboard ─────── */
  const Dashboard = () => (
    <div className="max-w-6xl mx-auto bg-gray-900/30 border border-gray-700 rounded-2xl p-8 backdrop-blur">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">{T.dashboard}</h2>
          <p className="text-gray-400">
            {bookings.length} {T.all.toLowerCase()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={T.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          >
            <option value="all">{T.all}</option>
            <option value="pendiente">{T.pending}</option>
            <option value="confirmada">{T.confirmed}</option>
            <option value="completada">{T.completed}</option>
            <option value="cancelada">{T.cancelled}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{b.patientName}</h3>
                <p className="text-xs text-gray-500">
                  ID: #{b.id} •{" "}
                  {new Date(b.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    colors.urgency[b.urgency]
                  }`}
                >
                  {T.urgencyLevels[b.urgency]}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    colors.status[b.status]
                  }`}
                >
                  {T.status[b.status]}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <InfoRow
                icon={<Mail className="h-4 w-4 text-pink-400" />}
                label="Email"
                value={b.email}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4 text-pink-400" />}
                label={T.phone}
                value={b.phone}
              />
              <InfoRow
                icon={<FileText className="h-4 w-4 text-pink-400" />}
                label={T.treatment}
                value={T.treatments[b.treatment]}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4 text-pink-400" />}
                label={T.preferredDate}
                value={b.preferredDate}
              />
              <InfoRow
                icon={<Clock className="h-4 w-4 text-pink-400" />}
                label={T.preferredTime}
                value={b.preferredTime}
              />
            </div>

            {b.medicalHistory && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-1">
                  {T.medicalHistory}
                </h4>
                <p className="text-sm text-gray-400 bg-gray-800/40 p-3 rounded-lg whitespace-pre-wrap break-words">
                  {b.medicalHistory}
                </p>
              </div>
            )}

            {b.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-1">
                  {T.notes}
                </h4>
                <p className="text-sm text-gray-400 bg-gray-800/40 p-3 rounded-lg whitespace-pre-wrap break-words">
                  {b.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-600 text-gray-300 hover:bg-gray-700/60 transition"
                title="Editar (WIP)"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeBooking(b.id)}
                className="px-3 py-2 rounded-lg bg-red-700/20 border border-red-600 text-red-400 hover:bg-red-700/40 transition"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {!filtered.length && (
          <p className="text-center text-gray-400">{T.all} ☹️</p>
        )}
      </div>
    </div>
  );

  /* ─────── Render ─────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto mb-10 gap-6">
        <h1 className="text-2xl font-bold">🦷 Dental Booking</h1>

        {/* Idiomas */}
        <div className="flex gap-2">
          {Object.entries(dictionaries).map(([code, d]) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-3 py-1 rounded-lg border ${
                lang === code
                  ? "border-pink-500 bg-pink-600/20"
                  : "border-gray-600 hover:bg-gray-700/40"
              } transition text-xl`}
            >
              {d.flag}
            </button>
          ))}
        </div>

        {/* Vistas */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("booking")}
            className={`px-4 py-2 rounded-lg ${
              view === "booking"
                ? "bg-pink-600/80"
                : "bg-gray-800/60 hover:bg-gray-700/60"
            } transition`}
          >
            {T.title.split(" ")[0]}
          </button>
          <button
            onClick={() => setView("dashboard")}
            className={`px-4 py-2 rounded-lg ${
              view === "dashboard"
                ? "bg-pink-600/80"
                : "bg-gray-800/60 hover:bg-gray-700/60"
            } transition`}
          >
            {T.dashboard}
          </button>
        </div>
      </header>

      {view === "booking" ? <BookingForm /> : <Dashboard />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900/90 backdrop-blur border border-pink-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span>{T.toastSuccess}</span>
        </div>
      )}
    </div>
  );
}
