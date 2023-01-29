type LinkButtonPropsType = {
  url: string;
  title: string;
  onClose: () => void;
};

interface CourseProps {
  views: number;
  title: string;
  imageSrc: string;
  id: string;
  addToPlaylistHandler: () => void;
  creator: string;
  description: string;
  lectureCount: number;
  loading: boolean;
}
