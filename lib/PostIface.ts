import { FrontMatterIface } from "./FrontMatterIface";

export interface PostIface extends FrontMatterIface {
  slug: string;
  fileName?: string;
  wordCount?: number;
}
