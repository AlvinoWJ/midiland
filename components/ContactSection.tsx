// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Search,
//   Phone,
//   Building,
//   User,
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   Navigation,
//   Loader2,
// } from "lucide-react";

// interface ContactPerson {
//   id: string;
//   imageUrl: string;
//   branch: string;
//   nama: string;
//   noHp: string;
//   alamat: string;
// }

// // --- DATA DUMMY ---
// const DUMMY_CONTACTS: ContactPerson[] = [
//   {
//     id: "1",
//     imageUrl: "https://placehold.co/600x400/3b82f6/white?text=Kantor+Pusat",
//     branch: "Kantor Pusat Jakarta",
//     nama: "Andi Wijaya",
//     noHp: "0812-3456-7890",
//     alamat: "Jl. Sudirman No. 1, Jakarta Pusat, DKI Jakarta 10220",
//   },
//   {
//     id: "2",
//     imageUrl: "https://placehold.co/600x400/10b981/white?text=Surabaya",
//     branch: "Cabang Surabaya",
//     nama: "Budi Santoso",
//     noHp: "0813-4567-8901",
//     alamat: "Jl. Basuki Rahmat No. 12, Surabaya, Jawa Timur 60271",
//   },
//   {
//     id: "3",
//     imageUrl: "https://placehold.co/600x400/f59e0b/white?text=Medan",
//     branch: "Cabang Medan",
//     nama: "Citra Lestari",
//     noHp: "0815-6789-0123",
//     alamat: "Jl. Gatot Subroto No. 30, Medan, Sumatera Utara 20119",
//   },
//   {
//     id: "4",
//     imageUrl: "https://placehold.co/600x400/8b5cf6/white?text=Bandung",
//     branch: "Cabang Bandung",
//     nama: "Dewi Anggraini",
//     noHp: "0817-8901-2345",
//     alamat: "Jl. Asia Afrika No. 55, Bandung, Jawa Barat 40111",
//   },
//   {
//     id: "5",
//     imageUrl: "https://placehold.co/600x400/ec4899/white?text=Makassar",
//     branch: "Cabang Makassar",
//     nama: "Eka Prasetyo",
//     noHp: "0818-9012-3456",
//     alamat: "Jl. Sultan Hasanuddin No. 10, Makassar, Sulawesi Selatan 90111",
//   },
//   {
//     id: "6",
//     imageUrl: "https://placehold.co/600x400/6366f1/white?text=Yogyakarta",
//     branch: "Cabang Yogyakarta",
//     nama: "Fajar Nugroho",
//     noHp: "0819-0123-4567",
//     alamat: "Jl. Malioboro No. 72, Yogyakarta, DI Yogyakarta 55213",
//   },
//   {
//     id: "7",
//     imageUrl: "https://placehold.co/600x400/14b8a6/white?text=Semarang",
//     branch: "Cabang Semarang",
//     nama: "Gita Permata",
//     noHp: "0812-1122-3344",
//     alamat: "Jl. Pemuda No. 150, Semarang, Jawa Tengah 50132",
//   },
//   {
//     id: "8",
//     imageUrl: "https://placehold.co/600x400/ef4444/white?text=Bali",
//     branch: "Cabang Denpasar",
//     nama: "Hadi Purnomo",
//     noHp: "0813-5566-7788",
//     alamat: "Jl. Teuku Umar No. 200, Denpasar, Bali 80114",
//   },
//   {
//     id: "9",
//     imageUrl: "https://placehold.co/600x400/22c55e/white?text=Palembang",
//     branch: "Cabang Palembang",
//     nama: "Indah Cahyani",
//     noHp: "0815-9988-7766",
//     alamat: "Jl. Jend. Sudirman No. 54, Palembang, Sumatera Selatan 30129",
//   },
// ];

// function ContactCard({ contact }: { contact: ContactPerson }) {
//   return (
//     <Card className="overflow-hidden shadow-lg border border-gray-100 rounded-2xl bg-white flex flex-col h-full transition-all duration-300 hover:shadow-xl">
//       <img
//         src={contact.imageUrl}
//         alt={`Foto kantor ${contact.branch}`}
//         className="w-full h-40 object-cover"
//         onError={(e) => {
//           const target = e.target as HTMLImageElement;
//           target.onerror = null;
//           target.src = `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(
//             contact.branch
//           )}`;
//         }}
//       />

//       <CardContent className="p-5 flex flex-col gap-3 flex-grow">
//         {/* Branch */}
//         <div className="flex items-center gap-2">
//           <Building size={16} className="text-primary flex-shrink-0" />
//           <h3
//             className="text-base font-semibold text-gray-900 truncate"
//             title={contact.branch}
//           >
//             {contact.branch}
//           </h3>
//         </div>
//         {/* Nama */}
//         <div className="flex items-start gap-2 text-sm text-gray-700">
//           <User size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
//           <span>{contact.nama}</span>
//         </div>
//         {/* No HP */}
//         <div className="flex items-start gap-2 text-sm text-gray-700">
//           <Phone size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
//           <span>{contact.noHp}</span>
//         </div>
//         {/* Alamat */}
//         <div className="flex items-start gap-2 text-sm text-gray-500">
//           <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
//           <span className="leading-snug">{contact.alamat}</span>
//         </div>
//       </CardContent>

//       {/* Tombol Aksi */}
//       <div className="p-5 pt-0 flex">
//         <Button
//           variant="outline"
//           size="sm"
//           className="gap-2 w-full border-primary text-primary bg-white hover:bg-primary/5 hover:text-primary rounded-full"
//           onClick={() => {
//             const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
//               contact.alamat
//             )}`;
//             window.open(mapsUrl, "_blank");
//           }}
//         >
//           <Navigation size={16} />
//           Lihat Rute
//         </Button>
//       </div>
//     </Card>
//   );
// }

// export function ContactSection({
//   contactList,
// }: {
//   contactList: ContactPerson[];
// }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const ITEMS_PER_PAGE = 8;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   const filteredContacts = useMemo(() => {
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) {
//       return contactList;
//     }
//     return contactList.filter(
//       (contact) =>
//         contact.nama.toLowerCase().includes(query) ||
//         contact.branch.toLowerCase().includes(query) ||
//         contact.alamat.toLowerCase().includes(query) ||
//         contact.noHp.includes(query)
//     );
//   }, [searchQuery, contactList]);

//   const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);

//   const displayedContacts = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     return filteredContacts.slice(startIndex, endIndex);
//   }, [filteredContacts, currentPage]);

//   const handlePrevPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   return (
//     <div>
//       {/* Judul dan Search Bar */}
//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 flex-shrink-0">
//           Ada kendala? hubungi kami :
//         </h2>

//         <div className="relative inline-flex items-center w-full md:w-auto">
//           <Search
//             className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             size={20}
//           />

//           <Input
//             type="text"
//             placeholder="Cari berdasarkan nama, branch, alamat..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             // [UBAH] Dibuat full width di mobile, auto di desktop
//             className="pl-10 pr-4 py-6 text-base rounded-full shadow-sm border-gray-200 bg-white w-full md:w-[38ch]"
//           />
//         </div>
//       </div>

//       {/* Grid Kontak */}
//       {displayedContacts.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {displayedContacts.map((contact) => (
//             <ContactCard key={contact.id} contact={contact} />
//           ))}
//         </div>
//       ) : (
//         // Pesan jika tidak ada hasil
//         <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-white rounded-2xl shadow-sm border-gray-100 min-h-[300px]">
//           <Search size={40} className="text-gray-400 mb-4" />
//           <p className="text-lg font-semibold text-gray-700">
//             Kontak tidak ditemukan
//           </p>
//           <p className="text-gray-500 max-w-xs">
//             Coba ganti kata kunci pencarian Anda untuk menemukan kontak yang
//             Anda cari.
//           </p>
//         </div>
//       )}

//       {/* Kontrol Paginasi */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-4 mt-10">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className="rounded-full"
//           >
//             <ChevronLeft size={20} />
//           </Button>
//           <span className="text-sm font-medium text-gray-700">
//             Halaman {currentPage} dari {totalPages}
//           </span>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className="rounded-full"
//           >
//             <ChevronRight size={20} />
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ContactPage() {
//   const [contactList, setContactList] = useState<ContactPerson[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Fungsi untuk mengambil data
//     const fetchContacts = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         setContactList(DUMMY_CONTACTS);
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("Terjadi kesalahan yang tidak diketahui");
//         }
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchContacts();
//   }, []); // []

//   // Tampilan Loading
//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-600">
//         <Loader2 size={48} className="animate-spin mb-4" />
//         <p className="text-lg font-medium">Memuat data kontak...</p>
//       </div>
//     );
//   }

//   // Tampilan Error
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[500px] text-red-600 bg-red-50 p-6 rounded-2xl">
//         <p className="text-lg font-semibold">Oops! Terjadi Kesalahan</p>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   // Tampilan Sukses
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <ContactSection contactList={contactList} />
//     </div>
//   );
// }
