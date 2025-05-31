import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Handshake, Search,  Users, Clock, TrendingUp, Star, Shield } from "lucide-react"
import Link from "next/link"


const mockProjects = [
  {
    cid: 1,
    creator: "7xKj9Rp2MwVq8uL3NzF5CdR1QaT6PbS4YeH8GmN9WvX2",
    title: "Solar-Powered Water Purification System",
    description: "Bringing clean water to rural communities using renewable solar energy technology. This system can purify 10,000 liters per day.",
    imageUrl: "/api/placeholder/400/240",
    goal: 50000000000, // 50k SOL in lamports
    amountRaised: 32500000000, // 32.5k SOL in lamports
    withdrawalsTotal: 0,
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
    deadline: Date.now() + (23 * 24 * 60 * 60 * 1000), // 23 days from now
    donors: 45,
    balance: 32500000000,
    isActive: true,
    category: "Social Impact",
    vouches: 18, // High vouches = high ranking
    vouchScore: 4.7, // Average reputation of vouchers
    totalStaked: 2500000000, // Total SOL staked by vouchers
  },
  {
    cid: 2,
    creator: "9mN5TqA8PzR3VwX7CkF2GbS6YeJ4LdH1UoP9QtM8WvN3",
    title: "Mental Health Support App",
    description: "Peer-to-peer mental health platform connecting users with trained volunteers and licensed therapists.",
    imageUrl: "/api/placeholder/400/240",
    goal: 60000000000,
    amountRaised: 58900000000,
    withdrawalsTotal: 10000000000,
    createdAt: Date.now() - (12 * 24 * 60 * 60 * 1000),
    deadline: Date.now() + (3 * 24 * 60 * 60 * 1000),
    donors: 128,
    balance: 48900000000,
    isActive: true,
    category: "Health",
    vouches: 25, // Highest vouches
    vouchScore: 4.9,
    totalStaked: 4200000000,
  },
  {
    cid: 3,
    creator: "5pL8KqR2NwT6VmX4BjG9CdF1YeH7SzP3UoM5QtN8WvR9",
    title: "Open Source AI Learning Platform",
    description: "Making machine learning education accessible through interactive courses, hands-on projects, and community mentorship.",
    imageUrl: "/api/placeholder/400/240",
    goal: 75000000000,
    amountRaised: 45200000000,
    withdrawalsTotal: 5000000000,
    createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000),
    deadline: Date.now() + (15 * 24 * 60 * 60 * 1000),
    donors: 89,
    balance: 40200000000,
    isActive: true,
    category: "Technology",
    vouches: 15,
    vouchScore: 4.5,
    totalStaked: 1800000000,
  },
  {
    cid: 4,
    creator: "3nM7RqP5LwS8VzX2CjF6GdH4YeK9TbP1UoL7QtR8WvN5",
    title: "Sustainable Urban Farming Kit",
    description: "Complete hydroponic system for growing fresh vegetables in small urban spaces. Includes LED lights and automated nutrient system.",
    imageUrl: "/api/placeholder/400/240",
    goal: 25000000000,
    amountRaised: 8500000000,
    withdrawalsTotal: 0,
    createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
    deadline: Date.now() + (41 * 24 * 60 * 60 * 1000),
    donors: 24,
    balance: 8500000000,
    isActive: true,
    category: "Environment",
    vouches: 12,
    vouchScore: 4.2,
    totalStaked: 900000000,
  },
  {
    cid: 5,
    creator: "8kJ6TqN4MwR7VpX3CjF5GdL2YeH9SzP8UoM4QtP7WvR1",
    title: "Community Workshop Space",
    description: "Creating a shared makerspace with 3D printers, woodworking tools, electronics lab, and community training programs.",
    imageUrl: "/api/placeholder/400/240",
    goal: 80000000000,
    amountRaised: 15600000000,
    withdrawalsTotal: 2000000000,
    createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000),
    deadline: Date.now() + (52 * 24 * 60 * 60 * 1000),
    donors: 31,
    balance: 13600000000,
    isActive: true,
    category: "Community",
    vouches: 8,
    vouchScore: 3.9,
    totalStaked: 600000000,
  },
  {
    cid: 6,
    creator: "2lK9PqM6NwT5VsX8CjF3GdR7YeH4SzP2UoL6QtN9WvM8",
    title: "Indie Game: Pixel Quest Adventures",
    description: "Retro-style RPG game featuring hand-crafted pixel art, original soundtrack, and engaging storyline about saving magical realms.",
    imageUrl: "/api/placeholder/400/240",
    goal: 30000000000,
    amountRaised: 12800000000,
    withdrawalsTotal: 1000000000,
    createdAt: Date.now() - (8 * 24 * 60 * 60 * 1000),
    deadline: Date.now() + (28 * 24 * 60 * 60 * 1000),
    donors: 67,
    balance: 11800000000,
    isActive: true,
    category: "Creative",
    vouches: 6,
    vouchScore: 4.1,
    totalStaked: 450000000,
  }
];

// Utility functions
const lamportsToSol = (lamports: number) => lamports / 1000000000;
const formatSol = (lamports: number) => `${lamportsToSol(lamports).toFixed(1)} SOL`;
const formatDaysLeft = (deadline: number) => Math.max(0, Math.ceil((deadline - Date.now()) / (24 * 60 * 60 * 1000)));

// Ranking algorithm based on vouches
const calculateProjectScore = (project: typeof mockProjects[0]) => {
  const vouchWeight = 0.4;
  const stakeWeight = 0.3;
  const qualityWeight = 0.2;
  const progressWeight = 0.1;
  
  const vouchScore = Math.min(project.vouches / 20, 1); // Normalize vouches (max 20)
  const stakeScore = Math.min(lamportsToSol(project.totalStaked) / 5000, 1); // Normalize stake (max 5k SOL)
  const qualityScore = project.vouchScore / 5; // Normalize quality score
  const progressScore = Math.min(project.amountRaised / project.goal, 1);
  
  return (vouchScore * vouchWeight) + 
         (stakeScore * stakeWeight) + 
         (qualityScore * qualityWeight) + 
         (progressScore * progressWeight);
};

function ProjectCard({ project, rank }: { project: typeof mockProjects[0], rank: number }) {
  const progressPercentage = (project.amountRaised / project.goal) * 100;
  const daysLeft = formatDaysLeft(project.deadline);
  const score = calculateProjectScore(project);

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-emerald-500/50 transition-all duration-300 group relative">
      {/* Ranking Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge 
          variant="secondary" 
          className={`${
            rank <= 3 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold' 
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          #{rank}
        </Badge>
      </div>

      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-gray-700 rounded-t-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
            <div className="text-gray-400">Project Image</div>
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-black/50 border-gray-600 text-white">
              {project.category}
            </Badge>
          </div>
          
          {/* Vouch Quality Indicator */}
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white">{project.vouchScore}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-white group-hover:text-emerald-400 transition-colors mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span className="font-mono text-xs">
              {project.creator.slice(0, 4)}...{project.creator.slice(-4)}
            </span>
          </div>

          {/* Vouch Information - Most Important */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Community Trust</span>
              </div>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-xs">
                Score: {(score * 100).toFixed(0)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white font-medium">{project.vouches} Vouches</div>
                <div className="text-gray-400">Community backing</div>
              </div>
              <div>
                <div className="text-white font-medium">{formatSol(project.totalStaked)}</div>
                <div className="text-gray-400">Total staked</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white font-medium">
                {formatSol(project.amountRaised)} raised
              </span>
              <span className="text-gray-400">
                of {formatSol(project.goal)}
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-400">
                {project.donors} backers
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{daysLeft} days left</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  // Sort projects by ranking score (vouches + stake + quality)
  const sortedProjects = [...mockProjects].sort((a, b) => 
    calculateProjectScore(b) - calculateProjectScore(a)
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <Handshake className="h-5 w-5 text-black" />
          </div>
          <span className="ml-2 text-xl font-bold">VeriFund</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/" className="text-sm font-medium hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link href="/projects" className="text-sm font-medium text-emerald-400">
            Projects
          </Link>
          <Link href="/create" className="text-sm font-medium hover:text-emerald-400 transition-colors">
            Create
          </Link>
          <Button variant="outline" size="sm" className="border-emerald-500/50 bg-transparent text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
            Connect Wallet
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Verified</span> Projects
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Projects ranked by community trust, vouches, and stake commitment
          </p>
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Shield className="w-4 h-4 mr-2" />
            Ranked by Community Verification
          </Badge>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search projects..." 
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="social-impact">Social Impact</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="vouches">
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="vouches">Most Vouched (Default)</SelectItem>
                <SelectItem value="stake">Highest Stake</SelectItem>
                <SelectItem value="funding">Most Funded</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="ending">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ranking Explanation */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            How Projects Are Ranked
          </h3>
          <p className="text-sm text-gray-400">
            Projects are ranked by a combination of <strong className="text-emerald-400">community vouches (40%)</strong>, 
            <strong className="text-cyan-400"> total stake amount (30%)</strong>, 
            <strong className="text-purple-400"> voucher reputation (20%)</strong>, and 
            <strong className="text-yellow-400"> funding progress (10%)</strong>.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{sortedProjects.length}</div>
            <div className="text-sm text-gray-400">Active Projects</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {formatSol(sortedProjects.reduce((sum, p) => sum + p.amountRaised, 0))}
            </div>
            <div className="text-sm text-gray-400">Total Raised</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {sortedProjects.reduce((sum, p) => sum + p.vouches, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Vouches</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {formatSol(sortedProjects.reduce((sum, p) => sum + p.totalStaked, 0))}
            </div>
            <div className="text-sm text-gray-400">Total Staked</div>
          </div>
        </div>

        {/* Projects Grid - Sorted by Ranking */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project, index) => (
            <Link key={project.cid} href={`/projects/${project.cid}`}>
              <ProjectCard project={project} rank={index + 1} />
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-emerald-500/50 bg-transparent text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            Load More Projects
          </Button>
        </div>
      </main>
    </div>
  );
}