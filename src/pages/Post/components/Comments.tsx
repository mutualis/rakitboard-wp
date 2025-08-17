import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Comment, commentsService } from "@/services/wordpressApi";
import { authService } from "@/services/wordpress/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CommentsProps {
  postId: number;
}

// Form validation schemas
const commentFormSchema = z.object({
  author_name: z.string().min(2, {
    message: "Nama harus minimal 2 karakter.",
  }),
  author_email: z.string().email({
    message: "Email harus valid.",
  }),
  content: z.string().min(10, {
    message: "Komentar harus minimal 10 karakter.",
  }),
});

const replyFormSchema = z.object({
  author_name: z.string().min(2, {
    message: "Nama harus minimal 2 karakter.",
  }),
  author_email: z.string().email({
    message: "Email harus valid.",
  }),
  content: z.string().min(5, {
    message: "Reply harus minimal 5 karakter.",
  }),
});

type CommentFormData = z.infer<typeof commentFormSchema>;
type ReplyFormData = z.infer<typeof replyFormSchema>;

function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Pagination state
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([]);
  const [commentsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);

  // Main comment form
  const commentForm = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      author_name: "",
      author_email: "",
      content: "",
    },
  });

  // Reply form
  const replyForm = useForm<ReplyFormData>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      author_name: "",
      author_email: "",
      content: "",
    },
  });

  // State untuk reply functionality
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replySubmitting, setReplySubmitting] = useState(false);

  // State untuk show/hide replies
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    setIsLoggedIn(authService.isAuthenticated());
    fetchComments();
  }, [postId]);

  // Update displayed comments when comments change
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * commentsPerPage;
    const newDisplayedComments = comments.slice(startIndex, endIndex);
    setDisplayedComments(newDisplayedComments);
    setHasMoreComments(endIndex < comments.length);
  }, [comments, currentPage, commentsPerPage]);

  const fetchComments = async () => {
    try {
      const commentsData = await commentsService.getByPost(postId, {
        status: "approve",
        per_page: 100,
      });
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CommentFormData) => {
    setSubmitting(true);
    setMessage("");

    try {
      if (isLoggedIn) {
        await commentsService.createAuth({
          post: Number(postId),
          content: data.content.trim(),
        });
        // setMessage("✅ Komentar berhasil dikirim!");
      } else {
        await commentsService.createGuest({
          post: Number(postId),
          content: data.content.trim(),
          author_name: data.author_name.trim(),
          author_email: data.author_email.trim(),
        });
        // setMessage("✅ Komentar berhasil dikirim dan menunggu moderasi.");
      }

      commentForm.reset();
      setCurrentPage(1); // Reset pagination
      await fetchComments();
    } catch (error: any) {
      console.error("Create comment error:", error);
      setMessage(
        `❌ ${
          error?.response?.data?.message ||
          "Gagal mengirim komentar. Pastikan Anda sudah login atau guest comment diizinkan."
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (data: ReplyFormData, parentId: number) => {
    setReplySubmitting(true);
    setMessage("");

    try {
      if (isLoggedIn) {
        await commentsService.createAuth({
          post: Number(postId),
          content: data.content.trim(),
          parent: parentId,
        });
        // setMessage("✅ Reply berhasil dikirim!");
      } else {
        await commentsService.createGuest({
          post: Number(postId),
          content: data.content.trim(),
          author_name: data.author_name.trim(),
          author_email: data.author_email.trim(),
          parent: parentId,
        });
        // setMessage("✅ Reply berhasil dikirim dan menunggu moderasi.");
      }

      replyForm.reset();
      setActiveReplyId(null);
      setCurrentPage(1); // Reset pagination
      await fetchComments();
    } catch (error: any) {
      console.error("Create reply error:", error);
      setMessage(
        `❌ ${error?.response?.data?.message || "Gagal mengirim reply."}`
      );
    } finally {
      setReplySubmitting(false);
    }
  };

  const toggleReplyForm = (commentId: number) => {
    if (activeReplyId === commentId) {
      setActiveReplyId(null);
      replyForm.reset();
    } else {
      setActiveReplyId(commentId);
      // Pre-fill dengan data dari main form jika ada
      if (!isLoggedIn) {
        const mainFormValues = commentForm.getValues();
        if (mainFormValues.author_name && mainFormValues.author_email) {
          replyForm.setValue("author_name", mainFormValues.author_name);
          replyForm.setValue("author_email", mainFormValues.author_email);
        }
      }
    }
  };

  const loadMoreComments = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment: Comment, depth: number = 0) => {
    const maxDepth = 3; // Batasi kedalaman reply
    const indentClass = depth > 0 ? `ml-${Math.min(depth * 8, 24)}` : "";

    // Function untuk render nested replies tanpa button
    const renderNestedReplies = (replies: Comment[], currentDepth: number) => {
      return replies.map((reply) => renderComment(reply, currentDepth + 1));
    };

    return (
      <div
        key={comment.id}
        className={`${indentClass} ${
          depth > 0 ? "border-l-2 border-gray-200 pl-4" : ""
        }`}
      >
        <div className="bg-muted p-6 rounded-lg mb-4">
          <div className="flex items-center gap-3 mb-3">
            {comment.author_avatar_urls?.["48"] && (
              <img
                src={comment.author_avatar_urls["48"]}
                alt={comment.author_name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <h4 className="font-semibold text-foreground">
                {comment.author_name}
              </h4>
              <time className="text-sm text-muted-foreground">
                {new Date(comment.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          </div>
          <div
            className="prose prose-sm max-w-none text-foreground mb-3"
            dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
          />

          {/* Reply Button */}
          {depth < maxDepth && (
            <Button
              variant="link"
              size="sm"
              onClick={() => toggleReplyForm(comment.id)}
              className="p-0 h-auto text-primary hover:text-primary/80"
            >
              {activeReplyId === comment.id ? "Batal Reply" : "Reply"}
            </Button>
          )}

          {/* Reply Form */}
          {activeReplyId === comment.id && (
            <div className="mt-4 bg-card border border-border rounded-lg p-4">
              <h5 className="text-sm font-semibold mb-3 text-card-foreground">
                Reply ke {comment.author_name}
              </h5>
              <Form {...replyForm}>
                <form
                  onSubmit={replyForm.handleSubmit((data) =>
                    handleReplySubmit(data, comment.id)
                  )}
                  className="space-y-3"
                >
                  {!isLoggedIn && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField
                        control={replyForm.control}
                        name="author_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Nama *"
                                className="text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={replyForm.control}
                        name="author_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Email *"
                                className="text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  <FormField
                    control={replyForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Tulis reply Anda..."
                            rows={3}
                            className="text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={replySubmitting}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {replySubmitting ? "Mengirim..." : "Kirim Reply"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReplyForm(comment.id)}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>

        {/* Render nested replies */}
        {comment.children && comment.children.length > 0 && (
          <div className="space-y-4">
            {/* Level 1 replies (depth === 0) selalu ditampilkan */}
            {depth === 0 &&
              comment.children.map((reply) => renderComment(reply, depth + 1))}

            {/* Level 2+ replies (depth >= 1) menggunakan show/hide */}
            {depth >= 1 && (
              <>
                {expandedReplies.has(comment.id) ? (
                  <>
                    {/* Render semua sub-replies dan sub-sub-replies sekaligus */}
                    {renderNestedReplies(comment.children, depth)}
                    {/* Button hide hanya muncul sekali */}
                    <div className="mt-2">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleReplies(comment.id)}
                        className="p-0 h-auto text-muted-foreground hover:text-foreground"
                      >
                        Sembunyikan semua replies
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="mt-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => toggleReplies(comment.id)}
                      className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    >
                      Tampilkan semua replies ({comment.children.length})
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="mt-12 border-t pt-8">
      {/* Main Comment Form */}
      <div className="bg-card border border-border rounded-lg p-6 mb-4">
        <h4 className="text-lg font-semibold mb-4 text-card-foreground">
          Tinggalkan Komentar
        </h4>
        <Form {...commentForm}>
          <form
            onSubmit={commentForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {!isLoggedIn && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={commentForm.control}
                  name="author_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama *</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama Anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={commentForm.control}
                  name="author_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Masukkan email Anda"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={commentForm.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Komentar *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis komentar Anda di sini..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Mengirim..." : "Kirim Komentar"}
            </Button>
          </form>
        </Form>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-foreground">
        Komentar ({comments.length})
      </h3>

      {/* Comments Info */}
      {comments.length > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          Menampilkan {displayedComments.length} dari {comments.length} komentar
        </p>
      )}

      {/* Message Display */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.includes("✅")
              ? "bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-400"
              : "bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-8">
          {displayedComments.map((comment) => renderComment(comment))}

          {/* Show More Comments Button */}
          {hasMoreComments && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={loadMoreComments}
                className="border-border text-foreground hover:bg-muted"
              >
                Tampilkan {comments.length - displayedComments.length} Komentar
                Lainnya
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground mb-8">
          Belum ada komentar. Jadilah yang pertama berkomentar!
        </p>
      )}
    </section>
  );
}

export default Comments;
