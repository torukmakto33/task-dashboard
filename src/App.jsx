import { useEffect, useMemo, useState } from 'react'
import './App.css'

const cities = [
  ['Adana', 37.0, 35.32], ['Adıyaman', 37.76, 38.28], ['Afyonkarahisar', 38.76, 30.54], ['Ağrı', 39.72, 43.05], ['Aksaray', 38.37, 34.03], ['Amasya', 40.65, 35.83], ['Ankara', 39.93, 32.86], ['Antalya', 36.89, 30.70], ['Ardahan', 41.11, 42.70], ['Artvin', 41.18, 41.82], ['Aydın', 37.85, 27.84], ['Balıkesir', 39.65, 27.88], ['Bartın', 41.63, 32.34], ['Batman', 37.88, 41.13], ['Bayburt', 40.26, 40.22], ['Bilecik', 40.15, 29.98], ['Bingöl', 38.89, 40.50], ['Bitlis', 38.40, 42.11], ['Bolu', 40.73, 31.61], ['Burdur', 37.72, 30.29], ['Bursa', 40.20, 29.06], ['Çanakkale', 40.15, 26.41], ['Çankırı', 40.60, 33.62], ['Çorum', 40.55, 34.95], ['Denizli', 37.78, 29.09], ['Diyarbakır', 37.91, 40.24], ['Düzce', 40.84, 31.16], ['Edirne', 41.68, 26.56], ['Elazığ', 38.68, 39.23], ['Erzincan', 39.75, 39.49], ['Erzurum', 39.90, 41.27], ['Eskişehir', 39.78, 30.52], ['Gaziantep', 37.07, 37.38], ['Giresun', 40.91, 38.39], ['Gümüşhane', 40.46, 39.48], ['Hakkâri', 37.58, 43.74], ['Hatay', 36.20, 36.16], ['Iğdır', 39.92, 44.04], ['Isparta', 37.76, 30.55], ['İstanbul', 41.01, 28.98], ['İzmir', 38.42, 27.14], ['Kahramanmaraş', 37.58, 36.93], ['Karabük', 41.20, 32.63], ['Karaman', 37.18, 33.22], ['Kars', 40.60, 43.10], ['Kastamonu', 41.38, 33.78], ['Kayseri', 38.72, 35.48], ['Kilis', 36.72, 37.12], ['Kırıkkale', 39.85, 33.51], ['Kırklareli', 41.73, 27.22], ['Kırşehir', 39.15, 34.16], ['Kocaeli', 40.77, 29.94], ['Konya', 37.87, 32.49], ['Kütahya', 39.42, 29.98], ['Malatya', 38.35, 38.31], ['Manisa', 38.62, 27.43], ['Mardin', 37.32, 40.72], ['Mersin', 36.81, 34.64], ['Muğla', 37.22, 28.36], ['Muş', 38.73, 41.49], ['Nevşehir', 38.62, 34.72], ['Niğde', 37.97, 34.68], ['Ordu', 40.98, 37.88], ['Osmaniye', 37.07, 36.25], ['Rize', 41.02, 40.52], ['Sakarya', 40.78, 30.40], ['Samsun', 41.28, 36.33], ['Siirt', 37.93, 41.94], ['Sinop', 42.03, 35.15], ['Sivas', 39.75, 37.02], ['Şanlıurfa', 37.17, 38.79], ['Şırnak', 37.52, 42.46], ['Tekirdağ', 40.98, 27.51], ['Tokat', 40.31, 36.55], ['Trabzon', 41.00, 39.72], ['Tunceli', 39.11, 39.55], ['Uşak', 38.68, 29.41], ['Van', 38.50, 43.38], ['Yalova', 40.65, 29.27], ['Yozgat', 39.82, 34.81], ['Zonguldak', 41.45, 31.79],
].map(([name, lat, lon]) => ({ name, lat, lon }))
const fallbackPrayers = [
  ['İmsak', '04:41', '☀️'], ['Güneş', '06:12', '🌤️'], ['Öğle', '13:08', '🌞'],
  ['İkindi', '16:37', '🌇'], ['Akşam', '19:58', '🌅'], ['Yatsı', '21:31', '🌙'],
]
const prayerIcons = { Fajr: '☀️', Sunrise: '🌤️', Dhuhr: '🌞', Asr: '🌇', Maghrib: '🌅', Isha: '🌙' }
const prayerNames = { Fajr: 'İmsak', Sunrise: 'Güneş', Dhuhr: 'Öğle', Asr: 'İkindi', Maghrib: 'Akşam', Isha: 'Yatsı' }
const tabs = [['home', '⌂', 'Bugün'], ['times', '◷', 'Vakitler'], ['tools', '✦', 'Araçlar'], ['settings', '⚙', 'Ayarlar']]

function stored(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function App() {
  const [onboarded, setOnboarded] = useState(() => stored('vaktin-onboarded', false))
  const [cityIndex, setCityIndex] = useState(() => stored('huzur-islamda-city', 38))
  const [district, setDistrict] = useState(() => stored('huzur-islamda-district', 'Merkez'))
  const [tab, setTab] = useState('home')
  const [qada, setQada] = useState(() => stored('vaktin-qada', [2, 1, 0, 3, 1]))
  const [dhikr, setDhikr] = useState(() => stored('vaktin-dhikr', 0))
  const [notifications, setNotifications] = useState(() => stored('vaktin-notifications', true))
  const [ramadan, setRamadan] = useState(() => stored('vaktin-ramadan', false))
  const [dark, setDark] = useState(() => stored('vaktin-dark', true))
  const [position, setPosition] = useState(null)
  const [heading, setHeading] = useState(0)
  const [sensorStatus, setSensorStatus] = useState('Telefonu çevirerek oku hareket ettir')
  const [livePrayers, setLivePrayers] = useState(() => stored('vaktin-prayers', fallbackPrayers))
  const [dataStatus, setDataStatus] = useState(() => stored('vaktin-prayer-status', 'cached'))
  const [locationStatus, setLocationStatus] = useState('Konum bekleniyor')
  const city = cities[cityIndex]
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))
  useEffect(() => {
    let cancelled = false
    const loadPrayerTimes = async (latitude = city.lat, longitude = city.lon) => {
      try {
        const date = new Date().toLocaleDateString('en-GB').split('/').join('-')
        const response = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=13&school=0`)
        if (!response.ok) throw new Error(`Prayer API returned ${response.status}`)
        const payload = await response.json()
        const timings = payload?.data?.timings
        if (!timings) throw new Error('Prayer API returned no timings')
        const nextPrayers = Object.keys(prayerNames).map((key) => [prayerNames[key], timings[key].slice(0, 5), prayerIcons[key]])
        if (cancelled) return
        setLivePrayers(nextPrayers)
        setDataStatus('live')
        save('vaktin-prayers', nextPrayers)
        save('vaktin-prayer-status', 'live')
      } catch (error) {
        if (cancelled) return
        console.warn('Canlı vakit verisi alınamadı, önbellek kullanılıyor.', error)
        setDataStatus('cached')
      }
    }
    loadPrayerTimes()
    if (!navigator.geolocation) {
      setLocationStatus('Şehir konumu kullanılıyor')
      return () => {
        cancelled = true
        window.removeEventListener('deviceorientationabsolute', onOrientation)
        window.removeEventListener('deviceorientation', onOrientation)
      }
    }
    navigator.geolocation.getCurrentPosition(
      (currentPosition) => {
        setLocationStatus('Konum kullanılıyor')
        setPosition({ latitude: currentPosition.coords.latitude, longitude: currentPosition.coords.longitude })
        loadPrayerTimes(currentPosition.coords.latitude, currentPosition.coords.longitude)
      },
      () => setLocationStatus('Şehir konumu kullanılıyor'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 86400000 },
    )
    const onOrientation = (event) => {
      const value = typeof event.webkitCompassHeading === 'number'
        ? event.webkitCompassHeading
        : typeof event.alpha === 'number' ? (360 - event.alpha) % 360 : null
      if (value !== null) {
        setHeading(value)
        setSensorStatus('Canlı sensör · telefonu yavaşça döndür')
      }
    }
    window.addEventListener('deviceorientationabsolute', onOrientation)
    window.addEventListener('deviceorientation', onOrientation)
    return () => { cancelled = true }
  }, [city.lat, city.lon])
  const next = useMemo(() => {
    const now = new Date().toTimeString().slice(0, 5)
    return livePrayers.find((item) => item[1] > now) ?? livePrayers[0]
  }, [livePrayers])
  const totalQada = qada.reduce((sum, value) => sum + value, 0)
  const changeCity = (index) => { setCityIndex(index); save('huzur-islamda-city', index) }
  const changeDistrict = (value) => { setDistrict(value); save('huzur-islamda-district', value) }
  const toggle = (key, setter, value) => { setter(!value); save(key, !value) }

  if (!onboarded) return <Onboarding onStart={(index, selectedDistrict) => { changeCity(index); changeDistrict(selectedDistrict); setOnboarded(true); save('vaktin-onboarded', true) }} />

  return <div className={dark ? 'app-shell' : 'app-shell light'}>
    <header className="topbar"><div className="brand"><span className="brand-mark">✦</span><div><b>Huzur İslamda</b><small>gününe niyet kat</small></div></div><button className="bell" onClick={() => toggle('vaktin-notifications', setNotifications, notifications)}>🔔<i className={notifications ? 'dot' : ''} /></button></header>
    <main className="content">
      {tab === 'home' && <Home city={city} district={district} next={next} prayers={livePrayers} totalQada={totalQada} dhikr={dhikr} setTab={setTab} dataStatus={dataStatus} locationStatus={locationStatus} />}
      {tab === 'times' && <Times city={city} district={district} prayers={livePrayers} onCity={changeCity} onDistrict={changeDistrict} dataStatus={dataStatus} />}
      {tab === 'tools' && <Tools city={city} position={position} heading={heading} sensorStatus={sensorStatus} setSensorStatus={setSensorStatus} qada={qada} setQada={(value) => { setQada(value); save('vaktin-qada', value) }} dhikr={dhikr} setDhikr={(value) => { setDhikr(value); save('vaktin-dhikr', value) }} />}
      {tab === 'settings' && <Settings cityIndex={cityIndex} city={city} district={district} onCity={changeCity} onDistrict={changeDistrict} notifications={notifications} setNotifications={() => toggle('vaktin-notifications', setNotifications, notifications)} ramadan={ramadan} setRamadan={() => toggle('vaktin-ramadan', setRamadan, ramadan)} dark={dark} setDark={() => toggle('vaktin-dark', setDark, dark)} />}
    </main>
    <nav className="bottom-nav">{tabs.map(([key, icon, label]) => <button className={tab === key ? 'active' : ''} onClick={() => setTab(key)} key={key}><span>{icon}</span>{label}</button>)}</nav>
  </div>
}

function Onboarding({ onStart }) {
  const [city, setCity] = useState(0)
  const [district, setDistrict] = useState('Merkez')
  return <div className="onboarding"><div className="onboard-card"><div className="brand large"><span className="brand-mark">✦</span><b>Huzur İslamda</b></div><div className="orbit">☾</div><span className="eyebrow">GÜNÜNE NİYET KAT</span><h1>Vaktin geldiğinde,<br /><em>kalbin de hazır olsun.</em></h1><p>Namaz vakitlerini, kıbleyi ve günlük ibadetlerini sade bir akışta yanında taşı.</p><label>İl</label><select value={city} onChange={(event) => setCity(Number(event.target.value))}>{cities.map((item, index) => <option value={index} key={item.name}>{item.name}</option>)}</select><label>İlçe</label><input value={district} onChange={(event) => setDistrict(event.target.value)} placeholder="İlçeni yaz (ör. Kadıköy)" /><button className="primary full" onClick={() => onStart(city, district)}>Huzurla başla →</button><small>81 il ve tüm ilçeler için ilçe adını arayabilirsin.</small></div></div>
}

function Home({ city, district, next, prayers, totalQada, dhikr, setTab, dataStatus, locationStatus }) {
  return <><section className="hero"><div className="hero-head"><div><span className="eyebrow">BUGÜN · {new Date().toLocaleDateString('tr-TR')}</span><h1>Selam, <em>güzel insan.</em></h1><button className="location">⌖ {city.name} / {district}⌄</button><small className="data-source">{dataStatus === 'live' ? 'Canlı hesaplama · Diyanet parametreleriyle (Aladhan)' : 'Son kayıtlı vakitler · İnternet bekleniyor'} · {locationStatus}</small></div><span className="sun">☼</span></div><div className="next-card"><div><small>Sıradaki vakit</small><b>{next[0]}</b><i>{next[2]}</i></div><strong>{next[1]}<small>yaklaşıyor</small></strong></div></section><section><div className="section-head"><h2>Bugünün vakitleri</h2><button onClick={() => setTab('times')}>Tümünü gör →</button></div><div className="prayer-strip">{prayers.map((item) => <div className={item[0] === next[0] ? 'prayer active' : 'prayer'} key={item[0]}><small>{item[0]}</small><b>{item[1]}</b><i>{item[2]}</i></div>)}</div></section><section><div className="section-head"><h2>Bugün senin için</h2></div><div className="quick-grid"><Quick icon="🧭" label="Kıbleyi bul" text="Yönünü keşfet" onClick={() => setTab('tools')} /><Quick icon="📖" label="Bir ayet oku" text="Kalbine iyi gelsin" onClick={() => setTab('tools')} /><Quick icon="✦" label="Zikre devam" text={`${dhikr} tekrar`} onClick={() => setTab('tools')} /><Quick icon="☾" label="Kaza takibi" text={`${totalQada} vakit kayıtlı`} onClick={() => setTab('tools')} /></div></section><div className="verse"><span>✧</span><div><small>Günün niyeti</small><p>“Şüphesiz namaz, müminler üzerine vakitleri belirlenmiş bir farzdır.”</p><i>Nisâ 4:103</i></div></div></>
}

function Times({ city, district, prayers, onCity, onDistrict, dataStatus }) {
  return <><div className="page-title"><div><span className="eyebrow">VAKİT DEFTERİ</span><h1>Namaz vakitleri</h1><select value={cities.findIndex((item) => item.name === city.name)} onChange={(event) => onCity(Number(event.target.value))}>{cities.map((item, index) => <option value={index} key={item.name}>{item.name}</option>)}</select><input className="district-input" value={district} onChange={(event) => onDistrict(event.target.value)} placeholder="İlçe ara veya yaz" /></div><span className="page-icon">◷</span></div><div className="date-card"><span>{city.name} / {district}<strong>25 Şaban 1447</strong></span><b>{dataStatus === 'live' ? '● canlı' : '◌ önbellek'}</b></div><div className="list">{prayers.map((item, index) => <div className={index === 0 ? 'time-row current' : 'time-row'} key={item[0]}><span>{item[2]}</span><div><b>{item[0]}</b><small>{index === 1 ? 'nafile' : 'farz'}</small></div><strong>{item[1]}</strong></div>)}</div><div className="banner">☾<div><b>Ramazan modu</b><small>Oruç ve iftar takibini aç</small></div><span>→</span></div></>
}

function Tools({ city, position, heading, sensorStatus, setSensorStatus, qada, setQada, dhikr, setDhikr }) {
  const [tool, setTool] = useState('qibla')
  const latitude = position?.latitude ?? city.lat
  const longitude = position?.longitude ?? city.lon
  const bearing = Math.round((Math.atan2(Math.sin((39.8262 - longitude) * Math.PI / 180), Math.cos(latitude * Math.PI / 180) * Math.tan(21.4225 * Math.PI / 180) - Math.sin(latitude * Math.PI / 180) * Math.cos((39.8262 - longitude) * Math.PI / 180)) * 180 / Math.PI + 360) % 360)
  const relativeBearing = (bearing - heading + 360) % 360
  const requestSensor = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission()
      setSensorStatus(permission === 'granted' ? 'Canlı sensör · telefonu yavaşça döndür' : 'Sensör izni verilmedi · sabit yön gösteriliyor')
    } else {
      setSensorStatus('Sensör hazır · telefonu yavaşça döndür')
    }
  }
  return <><div className="page-title"><div><span className="eyebrow">KALBİNE İYİ GELENLER</span><h1>Araçlar</h1></div><span className="page-icon">✦</span></div><div className="tool-tabs">{[['qibla', 'Kıble'], ['qada', 'Kaza'], ['ramadan', 'Ramazan'], ['quran', 'Kur’an'], ['dhikr', 'Zikir'], ['widget', 'Widget']].map(([key, label]) => <button className={tool === key ? 'selected' : ''} onClick={() => setTool(key)} key={key}>{label}</button>)}</div>{tool === 'qibla' && <div className="panel center"><small>KÂBE YÖNÜ · HASSAS HESAP</small><div className="compass" onClick={requestSensor}><span className="north-label">N</span><span className="east-label">E</span><span className="south-label">S</span><span className="west-label">W</span><div className="qibla-needle" style={{ transform: `rotate(${relativeBearing}deg)` }}><i>▲</i></div><b>✦</b></div><h2 className="bearing-value">{bearing}° <small>{bearing < 90 ? 'Kuzeydoğu' : bearing < 180 ? 'Güneydoğu' : bearing < 270 ? 'Güneybatı' : 'Kuzeybatı'}</small></h2><p>{position ? 'Telefonunun anlık konumundan Kâbe yönü' : `${city.name} merkezinden yaklaşık Kâbe yönü`}</p><small>{sensorStatus}. İbrenin Kâbe’ye dönmesi için oku sarı işaretle hizala.</small></div>}{tool === 'qada' && <Qada qada={qada} setQada={setQada} />}{tool === 'ramadan' && <Ramadan />}{tool === 'quran' && <Quran />}{tool === 'dhikr' && <Dhikr count={dhikr} setCount={setDhikr} />}{tool === 'widget' && <div className="panel widget-panel"><small>ANA EKRAN WIDGET’I</small><h2>Huzur İslamda mini görünümü</h2><div className="widget-preview"><span>✦ Huzur İslamda</span><b>İmsak <em>04:41</em></b><small>{city.name} · 25 Şaban 1447</small></div><p>Telefonunun ana ekranında sıradaki vakti tek bakışta görmek için bu ücretsiz görünümü kullanabilirsin.</p><button className="secondary">Widget’i ekleme rehberini gör</button></div>}</>
}

function Qada({ qada, setQada }) { return <div className="panel"><small>EMANET TAKİBİ</small><h2>Kaza namazların</h2><p>Takibini küçük adımlarla sürdür.</p>{['Sabah', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'].map((name, index) => <div className="counter" key={name}><b>{name}</b><span><button onClick={() => setQada(qada.map((value, i) => i === index ? Math.max(0, value - 1) : value))}>−</button><strong>{qada[index]}</strong><button onClick={() => setQada(qada.map((value, i) => i === index ? value + 1 : value))}>+</button></span></div>)}</div> }
function Ramadan() { return <div className="panel ramadan-panel"><span className="feature-symbol">☾</span><small>RAMAZAN REHBERİ</small><h2>Niyet, imsâk, iftar</h2><p>Gününü üç küçük hatırlatmayla takip et: sahurda niyet, gün içinde dua, iftarda şükür.</p><div className="ramadan-times"><span><small>İmsak</small><b>04:41</b></span><span><small>İftar</small><b>19:58</b></span></div><div className="progress"><i /></div><small>Bugünkü ibadet hedefi · %58</small><button className="secondary">✓ Bugünkü niyetimi işaretle</button></div> }
function Quran() { const [surah, setSurah] = useState(0); const readings = [['Fatiha', '1–7', 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'Hamd, âlemlerin Rabbi Allah’a mahsustur.'], ['İnşirah', '5–6', 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', 'Şüphesiz güçlükle beraber bir kolaylık vardır.'], ['Mülk', '1–2', 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ', 'Mülk elinde olan Allah ne yücedir.']]; const reading = readings[surah]; return <div className="panel quran-panel"><span className="feature-symbol">📖</span><small>GÜNLÜK OKUMA</small><h2>{reading[0]} Suresi · {reading[1]}</h2><p className="arabic">{reading[2]}</p><p>“{reading[3]}”</p><small>Yerel örnek metin · okumaya niyet et</small><div className="reading-tabs">{readings.map((item, index) => <button className={index === surah ? 'selected' : ''} onClick={() => setSurah(index)} key={item[0]}>{item[0]}</button>)}</div><button className="secondary">Okumayı tamamladım ✓</button></div> }
function Dhikr({ count, setCount }) { const [phrase, setPhrase] = useState('Subhanallah'); const phrases = ['Subhanallah', 'Elhamdülillah', 'Allahu ekber']; return <div className="panel center"><small>ZİKİRMATİK</small><h2>{phrase}</h2><button className="dhikr" onClick={() => setCount(count + 1)}>{count}<small>dokun ve zikret</small></button><div className="reading-tabs">{phrases.map((item) => <button className={item === phrase ? 'selected' : ''} onClick={() => setPhrase(item)} key={item}>{item}</button>)}</div><button className="reset" onClick={() => setCount(0)}>↻ Sıfırla</button></div> }
function Settings({ city, cityIndex, district, onCity, onDistrict, notifications, setNotifications, ramadan, setRamadan, dark, setDark }) { return <><div className="page-title"><div><span className="eyebrow">KENDİ RİTMİN</span><h1>Ayarlar</h1></div><span className="page-icon">⚙</span></div><div className="settings"><small>KONUM VE VAKİT</small><div className="setting"><span>⌖</span><div><b>İl</b><small>{city.name}, Türkiye</small></div><select value={cityIndex} onChange={(event) => onCity(Number(event.target.value))}>{cities.map((item, index) => <option value={index} key={item.name}>{item.name}</option>)}</select></div><div className="setting"><span>⌑</span><div><b>İlçe</b><small>Türkiye’deki tüm ilçeler desteklenir</small></div><input value={district} onChange={(event) => onDistrict(event.target.value)} placeholder="İlçe adı" /></div><Setting icon="🔔" title="Vakit bildirimleri" text="Vakit geldiğinde hatırlat" value={notifications} action={setNotifications} /><Setting icon="☾" title="Ramazan modu" text="İmsak ve iftarı öne çıkar" value={ramadan} action={setRamadan} /></div><div className="settings"><small>GÖRÜNÜM</small><Setting icon="☼" title="Koyu görünüm" text="Gözlerini yormayan gece renkleri" value={dark} action={setDark} /></div><div className="free-note">✧ Huzur İslamda her zaman ücretsiz ve reklamsız kalır.</div></> }
function Setting({ icon, title, text, value, action }) { return <div className="setting"><span>{icon}</span><div><b>{title}</b><small>{text}</small></div><button className={value ? 'toggle on' : 'toggle'} onClick={action}><i /></button></div> }
function Quick({ icon, label, text, onClick }) { return <button className="quick" onClick={onClick}><span>{icon}</span><b>{label}</b><small>{text}</small></button> }

export default App
