import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PropertyHistory {
    id: string;
    listingId: string;
    createdAt: bigint;
    year: bigint;
    previousOwner: string;
    event: string;
    currentOwner: string;
}
export interface SoilReport {
    id: string;
    soilType: string;
    listingId: string;
    floodRisk: string;
    reportDate: bigint;
    waterLogging: string;
    reportedBy: string;
    notes: string;
}
export interface LandListing {
    id: string;
    status: string;
    title: string;
    sellerWhatsapp: string;
    sellerPhone: string;
    pricePerDecimal: bigint;
    area: number;
    roadAccess: string;
    createdAt: bigint;
    division: string;
    description: string;
    district: string;
    verifiedBadge: string;
    sellerName: string;
    updatedAt: bigint;
    isVerified: boolean;
    isFeatured: boolean;
    address: string;
    landType: string;
    sellerId: string;
    price: bigint;
    roadWidth: string;
    upazila: string;
    orientation: string;
}
export interface DocumentMetadata {
    id: string;
    listingId: string;
    blobRef: ExternalBlob;
    fileName: string;
    isPublic: boolean;
    docType: string;
    uploadedAt: bigint;
}
export interface Lawyer {
    id: string;
    name: string;
    createdAt: bigint;
    isAvailable: boolean;
    description: string;
    email: string;
    updatedAt: bigint;
    specialization: string;
    phone: string;
    consultationFee: bigint;
    location: string;
}
export interface DocumentAccessRequest {
    id: string;
    status: string;
    requester: string;
    listingId: string;
    createdAt: bigint;
}
export interface Offer {
    id: string;
    status: string;
    counterPrice?: bigint;
    counterMessage?: string;
    listingId: string;
    createdAt: bigint;
    buyerPhone: string;
    updatedAt: bigint;
    offerPrice: bigint;
    message: string;
    buyerId: string;
    buyerName: string;
}
export interface NewsArticle {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: bigint;
    publishedAt: bigint;
    author: string;
    updatedAt: bigint;
    category: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    location: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDocumentMetadata(metadata: DocumentMetadata): Promise<void>;
    addPropertyHistory(history: PropertyHistory): Promise<void>;
    addSoilReport(report: SoilReport): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    counterOffer(id: string, counterPrice: bigint, counterMessage: string): Promise<void>;
    createLandListing(listing: LandListing): Promise<void>;
    createLawyer(lawyer: Lawyer): Promise<void>;
    createNewsArticle(article: NewsArticle): Promise<void>;
    deleteLandListing(id: string): Promise<void>;
    deleteLawyer(id: string): Promise<void>;
    deleteNewsArticle(id: string): Promise<void>;
    getAccessibleDocuments(listingId: string): Promise<Array<DocumentMetadata>>;
    getAllLandListings(): Promise<Array<LandListing>>;
    getAllLawyers(): Promise<Array<Lawyer>>;
    getAllNews(): Promise<Array<NewsArticle>>;
    getAllPublishedNews(): Promise<Array<NewsArticle>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDocumentAccessRequests(listingId: string): Promise<Array<DocumentAccessRequest>>;
    getFeaturedListings(): Promise<Array<LandListing>>;
    getLandListing(id: string): Promise<LandListing | null>;
    getLawyer(id: string): Promise<Lawyer | null>;
    getNewsArticle(id: string): Promise<NewsArticle | null>;
    getOffersByBuyer(buyerId: string): Promise<Array<Offer>>;
    getOffersByListing(listingId: string): Promise<Array<Offer>>;
    getPropertyHistory(listingId: string): Promise<Array<PropertyHistory>>;
    getSoilReport(listingId: string): Promise<SoilReport | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantDocumentAccess(requestId: string, status: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    requestDocumentAccess(request: DocumentAccessRequest): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchListings(division: string, district: string, upazila: string, minPrice: bigint, maxPrice: bigint, landType: string): Promise<Array<LandListing>>;
    submitOffer(offer: Offer): Promise<void>;
    toggleFeaturedListing(id: string): Promise<void>;
    updateLandListing(listing: LandListing): Promise<void>;
    updateLawyer(lawyer: Lawyer): Promise<void>;
    updateNewsArticle(article: NewsArticle): Promise<void>;
    updateOfferStatus(id: string, status: string): Promise<void>;
    updateSoilReport(report: SoilReport): Promise<void>;
}
