import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author <a href="mailto:jmowla@gmail.com"></a>Javad Mowlanezhasd</a>
 */
public class NetInfo {
    public static void main(String... args) {
        if (1 >= args.length) {
            if (0 == args.length) {
                args = new String[]{"default"};
            } else {
                switch (args[0]) {
                    case "-h":
                        System.out.println("Usage: java NetInfo [list of interfaces]");
                        System.out.println("This utility will return IPv4 address of the first interface which has valid IP");
                        System.out.println("The list of interfaces can be comma or space delimited.");
                        System.out.println("If no parameter is specified it will return IP address of the hostname");
                        System.out.println("options:\n\t-h: shows how to use!\n\t-l: shows list of all networks info");
                        System.out.println("\nExamples:\n\tjava NetInfo eth1 eth2 default\n\tjava NetInfo eth1,eth2 default\n\tjava NetInfo");
                        return;
                }
            }
        }
        try {
            networkInfo(expandCommaToIndividualEntryInArgs(args));
        } catch (SocketException ignored) {
        }
    }

    private static void networkInfo(String... args) throws SocketException {
        List<NetworkInterface> nets = Collections.list(NetworkInterface.getNetworkInterfaces());

        if ("-l".equals(args[0])) {
            for (NetworkInterface net : nets) {
                List<String> addresses = new ArrayList<>();

                for (InetAddress inetAddress : Collections.list(net.getInetAddresses())) {
                    addresses.add(inetAddress.getHostAddress());
                }
                System.out.println(net.getIndex() + " - " + net.getName() + " : " + net.getDisplayName() + ' ' + Arrays.toString(addresses.toArray()));
            }
        } else {
            for (String iface : args) {
                if ("default".equals(iface)) {
                    try {
                        System.out.print(InetAddress.getByName(InetAddress.getLocalHost().getHostName()).getHostAddress());
                    } catch (UnknownHostException ignored) {
                    }
                    return;
                }
                NetworkInterface net = NetworkInterface.getByName(iface);

                if (null != net) {
                    for (InetAddress inetAddress : Collections.list(net.getInetAddresses())) {
                        if (inetAddress instanceof Inet4Address) {
                            System.out.print(inetAddress.getHostAddress());
                            return;
                        }
                    }
                }
            }
        }
    }

    private static String[] expandCommaToIndividualEntryInArgs(String... args) {
        List<String> expandedArgs = new ArrayList<>();

        for (String arg : args) {
            expandedArgs.addAll(Arrays.asList(arg.split(",")));
        }
        return expandedArgs.toArray(new String[expandedArgs.size()]);
    }
}
