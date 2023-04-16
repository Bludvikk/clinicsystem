// ** React Imports
import { useState, SyntheticEvent, Fragment } from "react";

// ** Next Import
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Type Imports
import { Settings } from "src/@core/context/settingsContext";
import { toast } from "react-hot-toast";

interface Props {
  settings: Settings;
}

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { data, status } = useSession();

  // ** Hooks
  const router = useRouter();

  // ** Vars
  const { direction } = settings;

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    py: 2,
    px: 4,
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "text.primary",
    textDecoration: "none",
    "& svg": {
      mr: 2,
      fontSize: "1.375rem",
      color: "text.primary",
    },
  };

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully.");
    handleDropdownClose();
  };

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: "pointer" }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Avatar
          alt={status === "loading" ? "Loading..." : data?.user.userName}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src="/images/avatars/1.png"
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ "& .MuiMenu-paper": { width: 230, mt: 4 } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                alt={status === "loading" ? "Loading..." : data?.user.userName}
                src="/images/avatars/1.png"
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box
              sx={{
                display: "flex",
                ml: 3,
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {status === "loading" ? "Loading..." : data?.user.userName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.8rem", color: "text.disabled" }}
              >
                {status === "loading" ? "Loading..." : data?.user.role.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: "0 !important" }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="mdi:account-outline" />
            Profile
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="mdi:email-outline" />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="mdi:message-outline" />
            Chat
          </Box>
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 2,
            "& svg": { mr: 2, fontSize: "1.375rem", color: "text.primary" },
          }}
        >
          <Icon icon="mdi:logout-variant" />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
