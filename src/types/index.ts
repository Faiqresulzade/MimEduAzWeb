// Bütün tiplər backend-in real cavablarına (API_FRONTEND.md) uyğun yazılıb.
// Enum-lar JSON-da mətn kimi gəlir.

export type ResourceType = 'WorkSheet' | 'Presentation' | 'Test' | 'MethodGuide';
export type ResourceStatus = 'Pending' | 'Approved' | 'Rejected';
export type TrainingFormat = 'Live' | 'Online' | 'Video';
export type ItemType = 'Resource' | 'Training';
export type UserRole = 'Student' | 'Teacher' | 'Admin';
export type AccountType = 'Student' | 'Teacher';
export type EnrollmentStatus = 'InProgress' | 'Completed';

/* ---------- Auth ---------- */

export interface User {
  id: string;
  fullName: string;
  email: string;
  subject: string | null;
  roles: UserRole[];
  /** Yalnız Teacher/Admin resurs yükləyə bilir — şagird `POST /resources`-dan 403 alır. */
  canPublishResources: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  subject?: string;
  /** Göndərilməsə backend `Student` yaradır. */
  accountType?: AccountType;
}

export interface BecomeAuthorRequest {
  subject?: string;
}

/* ---------- Resources ---------- */

export interface Resource {
  id: string;
  name: string;
  subject: string;
  grade: number;
  type: ResourceType;
  authorId: string;
  authorName: string;
  downloads: number;
  isPaid: boolean;
  price: number;
  status: ResourceStatus;
  hasQuiz: boolean;
  createdAt: string;
  approvedAt: string | null;
}

export interface ResourceDetail extends Resource {
  authorSubject: string | null;
  rejectionReason: string | null;
  quizId: string | null;
  originalFileName: string | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ResourceQuery {
  subject?: string;
  grade?: number;
  type?: ResourceType;
  status?: ResourceStatus;
  isPaid?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface DownloadResult {
  resourceId: string;
  fileName: string;
  downloadUrl: string;
  downloads: number;
}

export interface AuthorProfile {
  id: string;
  fullName: string;
  subject: string | null;
  resourceCount: number;
  totalDownloads: number;
  resources: Resource[];
}

/* ---------- Trainings ---------- */

export interface Training {
  id: string;
  name: string;
  format: TrainingFormat;
  description: string;
  price: number;
  durationHours: number;
  metaLabel: string;
  seatLimit: number | null;
  seatsTaken: number;
  seatsLeft: number | null;
  lessonCount: number;
  createdAt: string;
}

export interface SyllabusItem {
  id: string;
  orderIndex: number;
  text: string;
}

export interface TrainingDetail extends Training {
  syllabus: SyllabusItem[];
  /** Yalnız token göndərilibsə mənalıdır — anonim sorğuda həmişə false. */
  isEnrolled: boolean;
}

export interface CreateTrainingRequest {
  name: string;
  format: TrainingFormat;
  description: string;
  price: number;
  durationHours: number;
  metaLabel: string;
  seatLimit: number | null;
  syllabus: string[];
  lessons?: LessonInput[];
}

export interface MyTraining {
  enrollmentId: string;
  trainingId: string;
  name: string;
  format: TrainingFormat;
  metaLabel: string;
  durationHours: number;
  progressPercent: number;
  status: EnrollmentStatus;
  enrolledAt: string;
  certificateCode: string | null;
  completedLessonCount: number;
  totalLessonCount: number;
  completedAt: string | null;
}

/* ---------- Training lessons ---------- */

export interface TrainingLesson {
  id: string;
  orderIndex: number;
  title: string;
  description: string;
  /** Yalnız təlimə yazılmış istifadəçiyə qaytarılır. */
  videoUrl: string | null;
  durationMinutes: number | null;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface TrainingLessons {
  trainingId: string;
  trainingName: string;
  lessons: TrainingLesson[];
  completedLessonCount: number;
  totalLessonCount: number;
  progressPercent: number;
  status: EnrollmentStatus;
  certificateCode: string | null;
}

export interface LessonProgress {
  trainingId: string;
  lessonId: string;
  isCompleted: boolean;
  completedLessonCount: number;
  totalLessonCount: number;
  progressPercent: number;
  status: EnrollmentStatus;
  /** Yalnız 100%-ə çatanda dolur. */
  certificateCode: string | null;
}

export interface LessonInput {
  title: string;
  description: string;
  videoUrl?: string;
  durationMinutes?: number;
}

export interface SaveLessonsRequest {
  mode: 'append' | 'replace';
  lessons: LessonInput[];
}

/* ---------- Cart & orders ---------- */

export interface CartItem {
  id: string;
  itemType: ItemType;
  itemId: string;
  name: string;
  price: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  id: string;
  itemType: ItemType;
  itemId: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  code: string;
  customerName: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

/* ---------- Quiz ---------- */

export interface QuizMeta {
  id: string;
  resourceId: string;
  resourceName: string;
  passPercent: number;
  questionCount: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  orderIndex: number;
  questionText: string;
  options: string[];
  // correctOptionIndex FRONTEND-Ə HEÇ VAXT GÖNDƏRİLMİR
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
}

export interface QuizSubmitResult {
  attemptId: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  passPercent: number;
  passed: boolean;
  certificateCode: string | null;
}

export interface SaveQuizRequest {
  passPercent: number;
  mode: 'append' | 'replace';
  questions: {
    questionText: string;
    options: string[];
    correctOptionIndex: number;
  }[];
}

/* ---------- Certificates ---------- */

export interface Certificate {
  id: string;
  code: string;
  holderName: string;
  description: string;
  trainingId: string | null;
  trainingName: string | null;
  issuedAt: string;
}

export interface CertificateVerifyResult {
  isValid: boolean;
  code: string;
  holderName: string | null;
  description: string | null;
  issuedAt: string | null;
}

/* ---------- Admin ---------- */

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  subject: string | null;
  roles: string[];
  resourceCount: number;
  approvedResourceCount: number;
  totalDownloads: number;
  enrollmentCount: number;
  certificateCount: number;
  createdAt: string;
}

export interface SalesSummary {
  gmv: number;
  commissionTotal: number;
  authorPayoutTotal: number;
  orderCount: number;
  itemCount: number;
  resourceRevenue: number;
  trainingRevenue: number;
  commissionPercent: number;
}

/* ---------- Blog ---------- */

export interface BlogPost {
  id: string;
  title: string;
  tag: string;
  readTime: string;
  excerpt: string;
  createdAt: string;
}

export interface BlogPostDetail extends BlogPost {
  body: string[];
}

/* ---------- Backend hazır olana qədər frontend-də hesablanan tiplər ---------- */

export interface AuthorEarnings {
  grossTotal: number;
  commissionTotal: number;
  netTotal: number;
  commissionPercent: number;
  perResource: {
    resourceId: string;
    name: string;
    unitsSold: number;
    price: number;
    net: number;
  }[];
}

export interface PlatformStats {
  resourceCount: number;
  trainingCount: number;
  teacherCount: number;
  totalDownloads: number;
}
