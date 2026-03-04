import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob } from "../backend";
import type {
  DocumentAccessRequest,
  DocumentMetadata,
  LandListing,
  Lawyer,
  NewsArticle,
  Offer,
  PropertyHistory,
  SoilReport,
  UserProfile,
} from "../backend.d";
import { UserRole } from "../backend.d";
import { useActor } from "./useActor";

// ===== LAND LISTINGS =====

export function useGetAllListings() {
  const { actor, isFetching } = useActor();
  return useQuery<LandListing[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLandListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedListings() {
  const { actor, isFetching } = useActor();
  return useQuery<LandListing[]>({
    queryKey: ["listings", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListing(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<LandListing | null>({
    queryKey: ["listings", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLandListing(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchListings(
  division: string,
  district: string,
  upazila: string,
  minPrice: bigint,
  maxPrice: bigint,
  landType: string,
) {
  const { actor, isFetching } = useActor();
  return useQuery<LandListing[]>({
    queryKey: [
      "listings",
      "search",
      division,
      district,
      upazila,
      minPrice.toString(),
      maxPrice.toString(),
      landType,
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchListings(
        division,
        district,
        upazila,
        minPrice,
        maxPrice,
        landType,
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listing: LandListing) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createLandListing(listing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listing: LandListing) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateLandListing(listing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteLandListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useToggleFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleFeaturedListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

// ===== PROPERTY HISTORY =====

export function useGetPropertyHistory(listingId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<PropertyHistory[]>({
    queryKey: ["property-history", listingId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertyHistory(listingId);
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

export function useAddPropertyHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (history: PropertyHistory) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPropertyHistory(history);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["property-history", variables.listingId],
      });
    },
  });
}

// ===== SOIL REPORT =====

export function useGetSoilReport(listingId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SoilReport | null>({
    queryKey: ["soil-report", listingId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSoilReport(listingId);
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

// ===== DOCUMENTS =====

export function useGetDocuments(listingId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<DocumentMetadata[]>({
    queryKey: ["documents", listingId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAccessibleDocuments(listingId);
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

export function useRequestDocumentAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: DocumentAccessRequest) => {
      if (!actor) throw new Error("Actor not available");
      return actor.requestDocumentAccess(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-access"] });
    },
  });
}

export function useGetDocumentAccessRequests(listingId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<DocumentAccessRequest[]>({
    queryKey: ["document-access", listingId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDocumentAccessRequests(listingId);
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

export function useGrantDocumentAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.grantDocumentAccess(requestId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-access"] });
    },
  });
}

export function useAddDocumentMetadata() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      metadata: Omit<DocumentMetadata, "blobRef"> & { blobUrl?: string },
    ) => {
      if (!actor) throw new Error("Actor not available");
      const blobRef = metadata.blobUrl
        ? ExternalBlob.fromURL(metadata.blobUrl)
        : ExternalBlob.fromURL("");
      return actor.addDocumentMetadata({ ...metadata, blobRef });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

// ===== OFFERS =====

export function useGetOffersByListing(listingId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Offer[]>({
    queryKey: ["offers", "listing", listingId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOffersByListing(listingId);
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

export function useGetOffersByBuyer(buyerId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Offer[]>({
    queryKey: ["offers", "buyer", buyerId],
    queryFn: async () => {
      if (!actor || !buyerId) return [];
      return actor.getOffersByBuyer(buyerId);
    },
    enabled: !!actor && !isFetching && !!buyerId,
  });
}

export function useSubmitOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (offer: Offer) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitOffer(offer);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["offers", "listing", variables.listingId],
      });
    },
  });
}

export function useCounterOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      counterPrice,
      counterMessage,
    }: {
      id: string;
      counterPrice: bigint;
      counterMessage: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.counterOffer(id, counterPrice, counterMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

export function useUpdateOfferStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOfferStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

// ===== LAWYERS =====

export function useGetAllLawyers() {
  const { actor, isFetching } = useActor();
  return useQuery<Lawyer[]>({
    queryKey: ["lawyers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLawyers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLawyer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lawyer: Lawyer) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createLawyer(lawyer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
    },
  });
}

export function useUpdateLawyer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lawyer: Lawyer) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateLawyer(lawyer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
    },
  });
}

export function useDeleteLawyer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteLawyer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
    },
  });
}

// ===== NEWS =====

export function useGetPublishedNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle[]>({
    queryKey: ["news", "published"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublishedNews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle[]>({
    queryKey: ["news", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNewsArticle(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle | null>({
    queryKey: ["news", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNewsArticle(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateNewsArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article: NewsArticle) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createNewsArticle(article);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}

export function useUpdateNewsArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article: NewsArticle) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateNewsArticle(article);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}

export function useDeleteNewsArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteNewsArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}

// ===== AUTH / USER =====

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
