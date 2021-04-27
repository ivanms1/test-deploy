export interface FileProps {
  id: number;
  name: string;
  tags: string[];
  is_liked: boolean;
  info: {
    content_hash: string;
    description: string;
    ext: string;
    file_name: string;
    public_hash: string;
    size: string;
    thumbnail: string;
    created_at: string;
  };
  content_stats: {
    likes_cnt: number;
    downloads_cnt: 0;
    rate: number;
  };

  user: {
    id: number;
    avatar: string;
    wallet_id: string;
  };
}
