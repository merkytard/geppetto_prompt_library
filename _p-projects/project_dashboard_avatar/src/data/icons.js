
    import { Home, LayoutDashboard, Columns, CheckSquare, Brain, Settings, FolderKanban, Package, Users, FileText, Image, Link, Video, Mic, Code, Palette, Calendar, Clock, Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, MoreHorizontal, GripVertical, ArrowUpDown, ListFilter, Moon, Sun, User as UserIcon, LogOut, Menu as MenuIcon, Bot, MessageCircle, Database, Trello, Briefcase, Workflow, ClipboardList, Megaphone, Smartphone, BarChart2, PieChart, Eye, EyeOff, Zap, ExternalLink, Bookmark, BookmarkCheck, BookmarkMinus, FolderPlus, FolderMinus, FolderCog, ListTree, AlertTriangle } from 'lucide-react';

    export const iconList = {
      Home, LayoutDashboard, Columns, CheckSquare, Brain, Settings, FolderKanban, Package, Users,
      FileText, Image, Link, Video, Mic, Code, Palette, Calendar, Clock, Search, Filter,
      ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, MoreHorizontal,
      GripVertical, ArrowUpDown, ListFilter, Moon, Sun, User: UserIcon, LogOut, Menu: MenuIcon, Bot, MessageCircle, // Renamed User to UserIcon and Menu to MenuIcon to avoid conflict
      Database, Trello, Briefcase, Workflow, ClipboardList, Megaphone, Smartphone, BarChart2, PieChart,
      Eye, EyeOff, Zap, ExternalLink, Bookmark, BookmarkCheck, BookmarkMinus, FolderPlus, FolderMinus, FolderCog, ListTree,
      Google: Zap, 
      AlertTriangle
    };

    export const nodeColors = [
      { name: 'Default', value: 'bg-card' },
      { name: 'Blue', value: 'bg-blue-500' },
      { name: 'Green', value: 'bg-green-500' },
      { name: 'Yellow', value: 'bg-yellow-500' },
      { name: 'Orange', value: 'bg-orange-500' },
      { name: 'Red', value: 'bg-red-500' },
      { name: 'Purple', value: 'bg-purple-500' },
      { name: 'Pink', value: 'bg-pink-500' },
      { name: 'Indigo', value: 'bg-indigo-500' },
      { name: 'Teal', value: 'bg-teal-500' },
      { name: 'Gray', value: 'bg-gray-500' },
      { name: 'Primary', value: 'bg-primary' },
      { name: 'Secondary', value: 'bg-secondary' },
    ];


    export const getIconComponent = (iconName) => {
      if (iconName && iconList[iconName]) {
        return iconList[iconName];
      }
      return AlertTriangle; 
    };

    export const getRandomIcon = () => {
      const iconKeys = Object.keys(iconList).filter(key => key !== 'AlertTriangle'); 
      const randomIndex = Math.floor(Math.random() * iconKeys.length);
      return iconKeys[randomIndex];
    };
  