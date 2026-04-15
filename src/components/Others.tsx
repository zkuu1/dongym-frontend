"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ShoppingCart, Tag, Box, Heart, Bookmark } from "lucide-react";
import { checkLikeStatus, toggleLike, getProductLikeCount } from "@/data/api/likeApi";
import { checkFavouriteStatus, toggleFavourite } from "@/data/api/favouriteApi";
import { getAllProduct } from "@/data/api/productApi";
import { getAllCategory } from "@/data/api/categoryApi";

import { getCommentsByProduct, createComment } from "@/data/api/commentApi";
import { MessageSquare, Clock, User as UserIcon, Send } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/auth";

interface Product {
  id: number;
  idCategory: number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  categoryName?: string;
}

interface CategoryData {
  id: number;
  name: string;
}

type CategoryFilter = "all" | string;

interface PortfolioCardProps {
  id: number;
  showCard: CategoryFilter;
  category: string;
  imageHref: string;
  title: string;
  onOpen: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  id,
  showCard,
  category,
  imageHref,
  title,
  onOpen,
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isFavourited, setIsFavourited] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      const user = getUser();
      if (user) {
        checkStatus();
      }
      fetchLikeCount();
    }, [id]);

    const fetchLikeCount = async () => {
      try {
        const res = await getProductLikeCount(id);
        setLikeCount(res.data.totalLikes);
      } catch (err) {
        // Silent fail
      }
    };
  
    const checkStatus = async () => {
      try {
        const [likeRes, favRes] = await Promise.all([
          checkLikeStatus(id),
          checkFavouriteStatus(id)
        ]);
        setIsLiked(likeRes.data.liked);
        setIsFavourited(favRes.data.Favourited);
      } catch (err) {
        // Silent fail for status check
      }
    };
  
    const handleToggleLike = async (e: React.MouseEvent) => {
      e.stopPropagation();
      const user = getUser();
      if (!user) {
        toast.info("Silakan login untuk menyukai produk.");
        router.push("/login");
        return;
      }
      setLoading(true);
      try {
        const res = await toggleLike(id);
        setIsLiked(!isLiked); 
        fetchLikeCount();
        toast.success(res.message);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleToggleFav = async (e: React.MouseEvent) => {
      e.stopPropagation();
      const user = getUser();
      if (!user) {
        toast.info("Silakan login untuk menyimpan produk.");
        router.push("/login");
        return;
      }
      setLoading(true);
      try {
        const res = await toggleFavourite(id);
        setIsFavourited(!isFavourited);
        toast.success(res.message);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

  const isVisible = showCard === "all" || showCard.toLowerCase() === category.toLowerCase();

  return (
    <motion.div
      className={`w-full px-4 md:w-1/2 xl:w-1/3 ${isVisible ? "block" : "hidden"}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="relative mb-12">
        <div className="overflow-hidden rounded-xl shadow-lg border border-white/5 ring-1 ring-white/5">
          <img
            src={imageHref}
            alt={title}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="relative z-10 mx-6 -mt-12 rounded-xl bg-gray-900 border border-gray-800 py-8 px-6 text-center shadow-lg backdrop-blur-sm">
          <span className="text-cyan-400 mb-2 block text-xs font-black uppercase tracking-[0.2em]">
            {category}
          </span>
          <h3 className="text-white mb-5 text-xl font-black tracking-tight">
            {title}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <button
               onClick={onOpen}
               className="flex-1 rounded-lg border border-base_semi_purple py-2 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-base_purple"
            >
               Details
            </button>
            <button 
                onClick={handleToggleLike}
                disabled={loading}
                className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 ${isLiked ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-gray-800 text-gray-500 hover:text-red-400 hover:border-red-400/50'}`}
            >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold">{likeCount}</span>
            </button>
            <button 
                onClick={handleToggleFav}
                disabled={loading}
                className={`p-2 rounded-lg border transition-all ${isFavourited ? 'bg-cyan-500/10 border-cyan-500 text-cyan-500' : 'border-gray-800 text-gray-500 hover:text-cyan-400 hover:border-cyan-400/50'}`}
            >
                <Bookmark size={18} fill={isFavourited ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};



const CommentsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}> = ({ isOpen, onClose, product }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && product) {
      fetchComments();
    }
  }, [isOpen, product]);

  const fetchComments = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const res = await getCommentsByProduct(product.id);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    const user = getUser();
    if (!user) {
      toast.info("Silakan login terlebih dahulu untuk memberikan ulasan.");
      router.push("/login");
      return;
    }
    setIsWritingReview(true);
  };

  const handleSubmitReview = async () => {
    if (!product) return;
    if (!newComment.trim()) {
      toast.error("Ulasan tidak boleh kosong.");
      return;
    }

    setSubmitting(true);
    try {
      await createComment(product.id, { comment: newComment });
      toast.success("Ulasan berhasil dikirim!");
      setNewComment("");
      setIsWritingReview(false);
      fetchComments(); // Refresh comments list
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim ulasan.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-[calc(100%-2rem)] sm:max-w-lg"
            initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
          >
            <div className="bg-gray-900 border border-gray-800 rounded-[2rem] shadow-2xl flex flex-col h-full sm:h-auto max-h-[85vh] overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-base_purple/10 text-base_purple">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tighter text-lg">Reviews</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-none">{product.name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="bg-gray-800 hover:bg-base_purple rounded-full p-2 transition-all group"
                >
                  <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-base_purple animate-spin mb-4" />
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Loading Catalog...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-20 px-8 rounded-2xl border-2 border-dashed border-gray-800/50">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Be the first to share your experience</p>
                  </div>
                ) : (
                  comments.map((c, idx) => (
                    <motion.div
                      key={c.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-5 rounded-2xl bg-gray-950/50 border border-gray-800/50 flex gap-4 hover:border-gray-700 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {c.userImage ? (
                          <img src={c.userImage} alt={c.userName} className="w-10 h-10 rounded-xl object-cover border border-gray-800" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-800 text-gray-600">
                            <UserIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-[10px] font-black text-white pr-2 uppercase italic tracking-wide">{c.userName || "Anonymous Athlete"}</h4>
                          <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-bold uppercase">
                            <Clock className="w-3 h-3" />
                            {formatDate(c.createdAt)}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed truncate-3-lines">
                          {c.comment}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>


              <div className="p-6 bg-gray-950/80 border-t border-gray-800">
                {isWritingReview ? (
                  <div className="space-y-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Bagikan pengalaman latihanmu dengan produk ini..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-base_purple outline-none transition-all placeholder:text-gray-600 resize-none h-32"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsWritingReview(false)}
                        className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:bg-gray-800 transition-all"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={submitting}
                        className="flex-[2] py-3 rounded-xl bg-base_purple text-white font-black uppercase italic tracking-tighter hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Kirim Ulasan
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                  onClick={handleWriteReview}
                  className="w-full py-4 rounded-xl bg-white text-gray-900 font-black uppercase tracking-tighter hover:bg-base_purple hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    Write a Review
                 </button>
                )}
              </div>
            </div>
            <ToastContainer position="bottom-right" theme="dark" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}> = ({ isOpen, onClose, product }) => {
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && product) {
        checkStatus();
        fetchLikeCount();
    }
  }, [isOpen, product]);

  const fetchLikeCount = async () => {
    if (!product) return;
    try {
      const res = await getProductLikeCount(product.id);
      setLikeCount(res.data.totalLikes);
    } catch (err) {
      // Silent fail
    }
  };

  const checkStatus = async () => {
    if (!product) return;
    try {
      const [likeRes, favRes] = await Promise.all([
        checkLikeStatus(product.id),
        checkFavouriteStatus(product.id)
      ]);
      setIsLiked(likeRes.data.liked);
      setIsFavourited(favRes.data.Favourited);
    } catch (err) {
      // Silent fail
    }
  };

  const handleToggleLike = async () => {
    if (!product) return;
    const user = getUser();
    if (!user) {
      toast.info("Silakan login untuk menyukai produk.");
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await toggleLike(product.id);
      setIsLiked(!isLiked);
      fetchLikeCount(); // Refresh count
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFav = async () => {
    if (!product) return;
    const user = getUser();
    if (!user) {
      toast.info("Silakan login untuk menyimpan produk.");
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await toggleFavourite(product.id);
      setIsFavourited(!isFavourited);
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/90 z-[60] backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[calc(100%-2rem)] max-w-4xl"
            initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 bg-gray-900/80 hover:bg-base_purple 
                          backdrop-blur-md rounded-full p-2.5 transition-all duration-300 group border border-gray-700"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
              </button>

              {/* Left Side: Image */}
              <div className="w-full md:w-1/2 h-72 md:h-auto relative overflow-hidden group/img">
                <img
                  src={product.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8">
                   <span className="bg-base_purple text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] mb-3 inline-block shadow-lg shadow-base_purple/30">
                    {product.categoryName || "Premium"}
                  </span>
                  <h2 className="text-4xl font-black text-white leading-tight tracking-tighter">
                    {product.name}
                  </h2>
                </div>
              </div>

              {/* Right Side: Details & Comments */}
              <div className="w-full md:w-1/2 p-10 flex flex-col overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-3xl font-black text-cyan-400 font-mono tracking-tighter flex items-center gap-2">
                    {formatPrice(product.price)}
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${product.stock > 0 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"} text-[10px] font-bold uppercase tracking-wider`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.stock > 0 ? "bg-emerald-400" : "bg-red-400"}`} />
                    {product.stock > 0 ? `In Stock (${product.stock})` : "Sold Out"}
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                   <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors">
                      <Tag className="w-5 h-5 text-base_purple mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5">Description</p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {product.description || "Designed for elite performance. Hand-selected components ensuring the highest quality for your fitness journey."}
                        </p>
                      </div>
                   </div>
                </div>

                {/* Toggle Comments Button */}
                <button 
                  onClick={() => setCommentModalOpen(true)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-900 border border-gray-800 hover:bg-gray-800/50 transition-all mb-4 group shrink-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-base_purple/10 text-base_purple group-hover:bg-base_purple group-hover:text-white transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Product Comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-mono">View All Feedbacks</span>
                    <Box className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:scale-110 transition-all" />
                  </div>
                </button>

                <div className="mt-auto pt-6 flex gap-3">
                   <button className="flex-[2] group relative overflow-hidden rounded-2xl bg-white px-2 py-4 font-black uppercase tracking-tighter text-gray-950 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      <div className="absolute inset-0 flex h-full w-0 bg-base_purple transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                      <span className="relative flex items-center justify-center gap-2 group-hover:text-white">
                        <ShoppingCart className="w-5 h-5" />
                        Order Di Kasir
                      </span>
                   </button>
                    <button 
                       onClick={handleToggleLike}
                       className={`flex-1 rounded-2xl border transition-all flex flex-col items-center justify-center p-3 gap-1 ${isLiked ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-gray-900 border-gray-800 text-white hover:bg-gray-800'}`}
                    >
                       <div className="flex items-center gap-2">
                         <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                         <span className="text-xs font-black">{likeCount}</span>
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{isLiked ? "Liked" : "Like"}</span>
                    </button>
                    <button 
                       onClick={handleToggleFav}
                       className={`flex-1 rounded-2xl border transition-all flex flex-col items-center justify-center p-3 gap-1 ${isFavourited ? 'bg-cyan-500/10 border-cyan-500 text-cyan-500' : 'bg-gray-900 border-gray-800 text-white hover:bg-gray-800'}`}
                    >
                       <Bookmark size={20} fill={isFavourited ? "currentColor" : "none"} />
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{isFavourited ? "Saved" : "Save"}</span>
                    </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    <CommentsModal 
      isOpen={commentModalOpen}
      onClose={() => setCommentModalOpen(false)}
      product={product}
    />
    </>
  );
};

const Others: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState<CategoryFilter>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          getAllProduct(),
          getAllCategory(),
        ]);

        const cats = catRes.data || [];
        const prods = (prodRes.data || []).map((p: any) => ({
          ...p,
          categoryName: cats.find((c: any) => c.id === p.idCategory)?.name || "Product",
        }));

        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("Failed to fetch products/categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const filterOptions: CategoryFilter[] = [
    "all",
    ...categories.map((c) => c.name),
  ];

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-base_purple/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="mx-auto mb-20 max-w-2xl text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-base_purple font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            Premium Selection
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white">
               Our <span className="text-base_purple">Catalog</span>
             </h2>
          <div className="w-24 h-1.5 bg-base_purple mx-auto mt-6 rounded-full" />
          <p className="text-gray-400 max-w-xl mx-auto mt-8 text-lg leading-relaxed">
            Elevate your training with our curated selection of supplements, 
            premium equipment, and elite private trainer services.
          </p>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center mb-16 gap-3">
          {filterOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setShowCard(cat)}
              className={`group relative overflow-hidden rounded-xl py-3 px-8 text-xs font-bold uppercase tracking-widest transition-all duration-500 ${
                showCard === cat
                  ? "bg-base_purple text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : "bg-gray-900/50 text-gray-500 border border-gray-800 hover:border-gray-600"
              }`}
            >
              <div className={`absolute inset-0 bg-base_purple transition-transform duration-500 -translate-x-full group-hover:translate-x-0 ${showCard === cat ? "translate-x-0" : ""}`} />
              <span className="relative z-10">{cat === "all" ? "Explore All" : cat}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-base_purple animate-spin mb-4" />
            <p className="text-gray-500 font-mono text-sm tracking-widest animate-pulse uppercase">Synchronizing Catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 px-10 rounded-3xl border-2 border-dashed border-gray-800">
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Our catalog is currently being updated. Please check back soon.</p>
          </div>
        ) : (
          <motion.div 
            className="flex flex-wrap -mx-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {products
                .filter(p => showCard === "all" || p.categoryName === showCard)
                .map((product) => (
                  <PortfolioCard
                    id={product.id}
                    key={product.id}
                    imageHref={product.image}
                    category={product.categoryName || "Product"}
                    title={product.name}
                    showCard={showCard}
                    onOpen={() => openModal(product)}
                  />
                ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
      />
    </section>
  );
};

export default Others;
