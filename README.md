# MIMEDU.AZ — Frontend

React 19 + Vite + TypeScript + Tailwind CSS 3.4.
Backend: [`MimEduAz`](../MimEduAz) (ASP.NET Core Web API).

## Başlanğıc

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

Backend `http://localhost:5297`-də işləməlidir (`dotnet run --project src/MimeduAz.Api`).
Backend-in CORS siyahısında `http://localhost:5173` artıq açıqdır.

API ünvanını dəyişmək üçün `.env`:

```
VITE_API_ORIGIN=http://localhost:5297
```

`/api/v1` prefiksi kodda əlavə olunur. Statik fayllar (`/uploads/...`) prefiks olmadan
birbaşa origin-dən verilir — `fileUrl()` funksiyası bunu nəzərə alır.

## Test hesabları (yalnız Development seed)

| E-poçt | Şifrə | Rol |
|---|---|---|
| `admin@mimedu.az` | `Admin123!` | Admin |
| `nigar@mimedu.az` | `Teacher123!` | Teacher |
| `elvin@mimedu.az` | `Teacher123!` | Teacher |

Test sertifikat kodu: `MIM-2026-4417`.

## Production

`npm run build` `mode: production` ilə işlədikdə Vite `.env.production`-u avtomatik
oxuyur — bu fayl artıq repoda var və `VITE_API_ORIGIN=https://mimeduazback.onrender.com`
göstərir. Yəni sadəcə build alıb `dist/`-i statik host-a yükləmək kifayətdir, əlavə
mühit dəyişəni təyin etməyə ehtiyac yoxdur (istəsəniz host panelindən override edə
bilərsiniz).

React Router `BrowserRouter` istifadə etdiyi üçün host tərəfdə **bütün yolları
`index.html`-ə yönləndirən SPA rewrite qaydası** olmalıdır, yoxsa `/telimler` kimi
birbaşa ünvanlar 404 verər. Üç ən çox yayılmış platforma üçün konfiqurasiya artıq
repoda hazırdır:

| Platforma | Fayl | Qeyd |
|---|---|---|
| Vercel | `vercel.json` | Repo-nu import edin, əlavə tənzimləmə lazım deyil |
| Netlify | `netlify.toml` + `public/_redirects` | Build command: `npm run build`, publish: `dist` |
| Render (Static Site) | `render.yaml` | Backend ilə eyni hesabda, "New → Static Site" |

Backend-in `Cors:AllowedOrigins` siyahısında (`appsettings.json`) frontend-in yayımlanan
domeni əlavə olunmalıdır — hazırda yalnız `https://mimedu.az` var (§ Program.cs).

**⚠️ Bilinən blokerdir:** yazı tarixinə (2026-09-06) `mimeduazback.onrender.com`
üzərindəki bütün data endpoint-ləri (`/resources`, `/trainings`, `/blog` və s.) `500`
qaytarır (Swagger UI-nin özü açılsa da). Bu backend tərəfli problemdir — DB migration/seed
Render-də icra olunmayıb, ya da connection string səhvdir. Frontend production build-i
hazırdır, amma backend düzələnə qədər deploy edilən sayt boş/xətalı görünəcək.

## Struktur

```
src/
├── api/          # Axios instance + endpoint modulları
│   ├── client.ts     # JWT interceptor, refresh rotasiyası, ApiError
│   └── pending.ts    # ⚠️ backend-də HƏLƏ OLMAYAN əməliyyatlar
├── context/      # Auth, Cart, Toast
├── hooks/        # useAuth, useCart, useToast, useAddToCart, useDownload, useSectionLink
├── layouts/      # PublicLayout, WorkspaceLayout
├── components/   # ui/, layout/, home/, resources/, trainings/, quiz/, cart/, workspace/
├── pages/        # route-lara bağlı səhifələr
├── lib/          # format helper-ləri, sabitlər
├── data/         # statik məzmun (FAQ, promptlar, rəylər)
└── types/        # backend DTO-larına uyğun TS tipləri
```

## Autentifikasiya

- `accessToken` yaddaşda (modul dəyişəni) saxlanılır — XSS səthini kiçildir.
- `refreshToken` `localStorage`-dadır (httpOnly cookie backend tərəfdən verilmir).
- `401` alınanda interceptor bir dəfə `/auth/refresh` cəhdi edir və sorğunu təkrarlayır.
  Alınmasa sessiya təmizlənir və istifadəçi `/giris`-ə yönləndirilir.
- Rol **backend-in qaytardığı `roles` massivindən** oxunur, e-poçtdan yox.

## Ödəniş

Demo rejimdədir. Kart forması (`components/cart/PaymentForm.tsx`) tamamilə frontend-də
qalır — **kart nömrəsi, bitmə tarixi və CVC heç vaxt backend-ə göndərilmir**.
Backend-ə yalnız `POST /orders/checkout { customerName }` gedir.

## ⚠️ Backend-də hazır olmayan hissələr

Aşağıdakılar `src/api/pending.ts` faylında toplanıb. Backend hazır olanda **yalnız
həmin faylın içindəki funksiyaların gövdəsini** real endpoint çağırışı ilə əvəz etmək
kifayətdir — komponentlərə toxunmaq lazım deyil, qaytardıqları tiplər dəyişmir.

| Nə | Təklif olunan endpoint | Hazırkı həll |
|---|---|---|
| Müəllif qazancı / satılan ədəd | `GET /resources/mine/earnings` | `downloads × price × 0.8` (ödənişli resursu yalnız alan endirə bilir) |
| Ödəniş (payout) tələbi | `POST /payouts/request` | Lokal demo, toast |
| İmtahan silmə | `DELETE /resources/{id}/quiz` | Düymə deaktiv |
| Ana səhifə statistikası | `GET /stats` | Baza rəqəm + real resurs sayı |
| «İmtahan keçilib» statusu | `GET /quiz/attempts/mine` | Uğurlu submit-dən sonra `localStorage` |
| Bütün sertifikatlar (admin) | `GET /admin/certificates` | Yalnız cari sessiyada verilənlər |

## Route xəritəsi

| Route | Kim görə bilər |
|---|---|
| `/`, `/telimler`, `/telimler/:id`, `/resurslar`, `/resurslar/:id`, `/muellif/:id`, `/promptlar`, `/haqqimizda`, `/blog/:id` | Hamı |
| `/giris` | Yalnız qonaq |
| `/sebet`, `/sifarisler`, `/imtahan/:resourceId` | Yalnız login |
| `/panel/*` | Login (admin də daxil ola bilir — «Müəllim panelinə keç») |
| `/admin/*` | Yalnız Admin |

Ana səhifədəki sürüşmə hədəfləri: `#sertifikat`, `#faq`, `#blog`.
`#muellif` (komissiya şərtləri) `/haqqimizda` səhifəsindədir.
