import {
  ShieldAlert, Heart, Eye, MessageSquare, Handshake, Users,
  BrainCircuit, GitMerge, UsersRound, User, EyeOff, Crown,
  Wallet, Ghost, BookOpen, type LucideIcon,
} from 'lucide-react';

/** Category id -> icon, used by the library and category headers. */
export const categoryIcon: Record<string, LucideIcon> = {
  manipulation: ShieldAlert,
  relationships: Heart,
  'body-language': Eye,
  persuasion: MessageSquare,
  negotiation: Handshake,
  'human-behavior': Users,
  'cognitive-biases': BrainCircuit,
  'decision-making': GitMerge,
  'social-psychology': UsersRound,
  personality: User,
  'deception-detection': EyeOff,
  'power-dynamics': Crown,
  'behavioral-economics': Wallet,
  criminology: Ghost,
};

export function getCategoryIcon(name: string): LucideIcon {
  return categoryIcon[name] ?? BookOpen;
}
