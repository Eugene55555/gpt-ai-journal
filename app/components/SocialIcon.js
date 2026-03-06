import {
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Facebook,
  Instagram,
  Globe,
  Link as LinkIcon,
  Send,
  MessageCircle,
  Mail,
  MessageSquare,
  Music,
} from "lucide-react";

export default function SocialIcon({ name, size = 16, className = "" }) {
  switch (name?.toLowerCase()) {
    case "twitter":
    case "x":
      return <Twitter size={size} className={className} />;
    case "linkedin":
      return <Linkedin size={size} className={className} />;
    case "github":
      return <Github size={size} className={className} />;
    case "youtube":
      return <Youtube size={size} className={className} />;
    case "facebook":
      return <Facebook size={size} className={className} />;
    case "instagram":
      return <Instagram size={size} className={className} />;
    case "telegram":
      return <Send size={size} className={className} />; // Иконка бумажного самолетика
    case "whatsapp":
      return <MessageCircle size={size} className={className} />; // Иконка чата
    case "reddit":
    case "discord":
      return <MessageSquare size={size} className={className} />; // Иконка форума/сообщения
    case "tiktok":
      return <Music size={size} className={className} />; // Иконка музыки/видео
    case "email":
      return <Mail size={size} className={className} />; // Иконка почты
    case "globe":
    case "website":
      return <Globe size={size} className={className} />;
    default:
      return <LinkIcon size={size} className={className} />;
  }
}
