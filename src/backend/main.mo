import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Data types
  module LandListing {
    public func compare(listing1 : LandListing, listing2 : LandListing) : Order.Order {
      switch (Text.compare(listing1.division, listing2.division)) {
        case (#equal) { Text.compare(listing1.district, listing2.district) };
        case (order) { order };
      };
    };
  };

  type LandListing = {
    id : Text;
    title : Text;
    description : Text;
    division : Text;
    district : Text;
    upazila : Text;
    address : Text;
    area : Float;
    price : Nat;
    pricePerDecimal : Nat;
    landType : Text;
    roadAccess : Text;
    roadWidth : Text;
    orientation : Text;
    isFeatured : Bool;
    isVerified : Bool;
    verifiedBadge : Text;
    sellerId : Text;
    sellerName : Text;
    sellerPhone : Text;
    sellerWhatsapp : Text;
    status : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type PropertyHistory = {
    id : Text;
    listingId : Text;
    year : Nat;
    event : Text;
    previousOwner : Text;
    currentOwner : Text;
    createdAt : Int;
  };

  type SoilReport = {
    id : Text;
    listingId : Text;
    soilType : Text;
    floodRisk : Text;
    waterLogging : Text;
    reportedBy : Text;
    reportDate : Int;
    notes : Text;
  };

  type DocumentMetadata = {
    id : Text;
    listingId : Text;
    docType : Text;
    fileName : Text;
    uploadedAt : Int;
    isPublic : Bool;
    blobRef : Storage.ExternalBlob;
  };

  type DocumentAccessRequest = {
    id : Text;
    listingId : Text;
    requester : Text;
    status : Text;
    createdAt : Int;
  };

  type Offer = {
    id : Text;
    buyerId : Text;
    buyerName : Text;
    buyerPhone : Text;
    listingId : Text;
    offerPrice : Nat;
    message : Text;
    status : Text;
    createdAt : Int;
    updatedAt : Int;
    counterPrice : ?Nat;
    counterMessage : ?Text;
  };

  type Lawyer = {
    id : Text;
    name : Text;
    specialization : Text;
    phone : Text;
    email : Text;
    location : Text;
    consultationFee : Nat;
    description : Text;
    isAvailable : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  type NewsArticle = {
    id : Text;
    title : Text;
    content : Text;
    category : Text;
    publishedAt : Int;
    author : Text;
    isPublished : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
    location : Text;
  };

  // Storage
  let landListings = Map.empty<Text, LandListing>();
  let propertyHistories = Map.empty<Text, PropertyHistory>();
  let soilReports = Map.empty<Text, SoilReport>();
  let documentMetadata = Map.empty<Text, DocumentMetadata>();
  let documentAccessRequests = Map.empty<Text, DocumentAccessRequest>();
  let offers = Map.empty<Text, Offer>();
  let lawyers = Map.empty<Text, Lawyer>();
  let newsArticles = Map.empty<Text, NewsArticle>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // USER PROFILE MANAGEMENT
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // LAND LISTINGS
  public shared ({ caller }) func createLandListing(listing : LandListing) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create listings");
    };
    landListings.add(listing.id, listing);
  };

  public shared ({ caller }) func updateLandListing(listing : LandListing) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update listings");
    };
    landListings.add(listing.id, listing);
  };

  public shared ({ caller }) func deleteLandListing(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete listings");
    };
    landListings.remove(id);
  };

  public query func getLandListing(id : Text) : async ?LandListing {
    landListings.get(id);
  };

  public query func getAllLandListings() : async [LandListing] {
    landListings.values().toArray();
  };

  public query func getFeaturedListings() : async [LandListing] {
    landListings.values().toArray().filter(
      func(l) { l.isFeatured }
    );
  };

  public query func searchListings(
    division : Text,
    district : Text,
    upazila : Text,
    minPrice : Nat,
    maxPrice : Nat,
    landType : Text,
  ) : async [LandListing] {
    landListings.values().toArray().filter(
      func(l) {
        (division == "" or l.division == division) and
        (district == "" or l.district == district) and
        (upazila == "" or l.upazila == upazila) and
        (minPrice == 0 or l.price >= minPrice) and
        (maxPrice == 0 or l.price <= maxPrice) and
        (landType == "" or l.landType == landType)
      }
    );
  };

  public shared ({ caller }) func toggleFeaturedListing(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can toggle featured status");
    };
    switch (landListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let updatedListing = {
          listing with
          isFeatured = not listing.isFeatured;
        };
        landListings.add(id, updatedListing);
      };
    };
  };

  // PROPERTY HISTORY
  public shared ({ caller }) func addPropertyHistory(history : PropertyHistory) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add history");
    };
    propertyHistories.add(history.id, history);
  };

  public query func getPropertyHistory(listingId : Text) : async [PropertyHistory] {
    propertyHistories.values().toArray().filter(
      func(h) { h.listingId == listingId }
    );
  };

  // SOIL REPORTS
  public shared ({ caller }) func addSoilReport(report : SoilReport) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add reports");
    };
    soilReports.add(report.id, report);
  };

  public shared ({ caller }) func updateSoilReport(report : SoilReport) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update reports");
    };
    soilReports.add(report.id, report);
  };

  public query func getSoilReport(listingId : Text) : async ?SoilReport {
    let reports = soilReports.values().toArray();
    reports.find(
      func(r) { r.listingId == listingId }
    );
  };

  // DOCUMENT VAULT
  public shared ({ caller }) func addDocumentMetadata(metadata : DocumentMetadata) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add documents");
    };
    documentMetadata.add(metadata.id, metadata);
  };

  public shared ({ caller }) func requestDocumentAccess(request : DocumentAccessRequest) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can request document access");
    };
    documentAccessRequests.add(request.id, request);
  };

  public shared ({ caller }) func grantDocumentAccess(requestId : Text, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can grant document access");
    };
    switch (documentAccessRequests.get(requestId)) {
      case (null) { Runtime.trap("Access request not found") };
      case (?request) {
        let updatedRequest = { request with status };
        documentAccessRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getAccessibleDocuments(listingId : Text) : async [DocumentMetadata] {
    let allDocs = documentMetadata.values().toArray().filter(
      func(d) { d.listingId == listingId }
    );
    
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return allDocs;
    };
    
    allDocs.filter(func(d) { d.isPublic });
  };

  public query ({ caller }) func getDocumentAccessRequests(listingId : Text) : async [DocumentAccessRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view access requests");
    };
    documentAccessRequests.values().toArray().filter(
      func(r) { r.listingId == listingId }
    );
  };

  // OFFER NEGOTIATION
  public shared ({ caller }) func submitOffer(offer : Offer) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit offers");
    };
    offers.add(offer.id, offer);
  };

  public shared ({ caller }) func counterOffer(id : Text, counterPrice : Nat, counterMessage : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can counter offers");
    };
    
    switch (offers.get(id)) {
      case (null) { Runtime.trap("Offer not found") };
      case (?offer) {
        // Verify caller is the seller of the listing
        switch (landListings.get(offer.listingId)) {
          case (null) { Runtime.trap("Listing not found") };
          case (?listing) {
            let callerPrincipal = caller.toText();
            if (listing.sellerId != callerPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the seller or admin can counter this offer");
            };
            
            let updatedOffer = {
              offer with
              counterPrice = ?counterPrice;
              counterMessage = ?counterMessage;
              updatedAt = Time.now();
            };
            offers.add(id, updatedOffer);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateOfferStatus(id : Text, status : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update offer status");
    };
    
    switch (offers.get(id)) {
      case (null) { Runtime.trap("Offer not found") };
      case (?offer) {
        let callerPrincipal = caller.toText();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isBuyer = offer.buyerId == callerPrincipal;
        
        // Check if caller is the seller
        var isSeller = false;
        switch (landListings.get(offer.listingId)) {
          case (?listing) {
            isSeller := listing.sellerId == callerPrincipal;
          };
          case (null) {};
        };
        
        if (not (isAdmin or isBuyer or isSeller)) {
          Runtime.trap("Unauthorized: Only buyer, seller, or admin can update offer status");
        };
        
        let updatedOffer = { 
          offer with 
          status;
          updatedAt = Time.now();
        };
        offers.add(id, updatedOffer);
      };
    };
  };

  public query ({ caller }) func getOffersByListing(listingId : Text) : async [Offer] {
    let allOffers = offers.values().toArray().filter(
      func(o) { o.listingId == listingId }
    );
    
    // Admin can see all offers
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return allOffers;
    };
    
    // Seller can see all offers for their listing
    switch (landListings.get(listingId)) {
      case (?listing) {
        let callerPrincipal = caller.toText();
        if (listing.sellerId == callerPrincipal) {
          return allOffers;
        };
      };
      case (null) {};
    };
    
    // Buyers can only see their own offers
    let callerPrincipal = caller.toText();
    allOffers.filter(func(o) { o.buyerId == callerPrincipal });
  };

  public query ({ caller }) func getOffersByBuyer(buyerId : Text) : async [Offer] {
    let callerPrincipal = caller.toText();
    
    // Users can only see their own offers, admins can see all
    if (buyerId != callerPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own offers");
    };
    
    offers.values().toArray().filter(
      func(o) { o.buyerId == buyerId }
    );
  };

  // LAWYER DIRECTORY
  public shared ({ caller }) func createLawyer(lawyer : Lawyer) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create lawyers");
    };
    lawyers.add(lawyer.id, lawyer);
  };

  public shared ({ caller }) func updateLawyer(lawyer : Lawyer) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update lawyers");
    };
    lawyers.add(lawyer.id, lawyer);
  };

  public shared ({ caller }) func deleteLawyer(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete lawyers");
    };
    lawyers.remove(id);
  };

  public query func getLawyer(id : Text) : async ?Lawyer {
    lawyers.get(id);
  };

  public query func getAllLawyers() : async [Lawyer] {
    lawyers.values().toArray();
  };

  // NEWS FEED
  public shared ({ caller }) func createNewsArticle(article : NewsArticle) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create news");
    };
    newsArticles.add(article.id, article);
  };

  public shared ({ caller }) func updateNewsArticle(article : NewsArticle) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update news");
    };
    newsArticles.add(article.id, article);
  };

  public shared ({ caller }) func deleteNewsArticle(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete news");
    };
    newsArticles.remove(id);
  };

  public query func getNewsArticle(id : Text) : async ?NewsArticle {
    newsArticles.get(id);
  };

  public query func getAllPublishedNews() : async [NewsArticle] {
    newsArticles.values().toArray().filter(
      func(a) { a.isPublished }
    );
  };

  public query ({ caller }) func getAllNews() : async [NewsArticle] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all news");
    };
    newsArticles.values().toArray();
  };
};
