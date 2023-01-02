import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../src/assets/Logo.png";
import { SiteTitle } from "./data/links";
import { BrowserRouter } from "react-router-dom";
import Pages from "./pages/Pages";
import SearchBar from "material-ui-search-bar";
import Sidebar from "./components/sidebar/Sidebar";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* The top bar of the app */}
      <AppBar position="fixed" open={open}>
        <Toolbar id="navbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* Site information and search bar */}
          <div class="w-full flex items-center justify-evenly">
            <img src={Logo} alt={""} style={{ width: "80px" }} />
            <SiteTitle>sofiaAPI</SiteTitle>
            <SearchBar
              onChange={(e) => console.log(e)}
              onRequestSearch={(e) => console.log(e)}
            />
          </div>
        </Toolbar>
      </AppBar>
      {/* The sidebar of the application */}
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </Box>
    </Box>
  );
}
